document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.clamp-input');
    const formatRadios = document.querySelectorAll('input[name="format"]');
    const inputUnitRadios = document.querySelectorAll('input[name="inputUnit"]');
    const outputUnitRadios = document.querySelectorAll('input[name="outputUnit"]');
    const paddingDirectionRadios = document.querySelectorAll('input[name="paddingDirection"]');
    const marginDirectionRadios = document.querySelectorAll('input[name="marginDirection"]');
    const roundingCheckbox = document.querySelector('.rounding-checkbox');
    const resultElement = document.querySelector('.clamp-result');
    const toast = document.getElementById('toast');

    // Функция для расчета clamp значения
    function calculateClamp(minValue, maxValue, minWidth, maxWidth, inputUnit, outputUnit, enableRounding) {
        // Если значения одинаковые, возвращаем простое значение
        if (minValue === maxValue) {
            return `${minValue}${inputUnit}`;
        }

        // Конвертируем значения в пиксели для расчетов
        let minPx = inputUnit === 'px' ? minValue : minValue * 16;
        let maxPx = inputUnit === 'px' ? maxValue : maxValue * 16;

        // Рассчитываем slope и intercept
        const slope = (maxPx - minPx) / (maxWidth - minWidth);
        const intercept = minPx - slope * minWidth;

        // Конвертируем результат в нужную единицу
        let slopeValue = slope;
        let interceptValue = intercept;

        if (outputUnit === 'rem') {
            slopeValue = slope / 16;
            interceptValue = intercept / 16;
        }

        // Округление если включено
        if (enableRounding) {
            slopeValue = Math.round(slopeValue * 1000) / 1000; // Более точное округление
            interceptValue = Math.round(interceptValue * 1000) / 1000;
        }

        // Если slope очень маленький (меньше 0.001), используем упрощенную формулу
        if (Math.abs(slopeValue) < 0.001) {
            const unit = outputUnit === 'rem' ? 'rem' : 'px';
            const avgValue = (minValue + maxValue) / 2;
            return `${avgValue}${inputUnit}`;
        }

        const unit = outputUnit === 'rem' ? 'rem' : 'px';
        return `clamp(${minValue}${inputUnit}, ${interceptValue}${unit} + ${slopeValue}${unit} * 100vw, ${maxValue}${inputUnit})`;
    }

    // Функция для генерации CSS кода
    function generateCode() {
        const minPadding = parseFloat(document.querySelector('[data-field="minPadding"]')?.value) || 0;
        const maxPadding = parseFloat(document.querySelector('[data-field="maxPadding"]')?.value) || 0;
        const minMargin = parseFloat(document.querySelector('[data-field="minMargin"]')?.value) || 0;
        const maxMargin = parseFloat(document.querySelector('[data-field="maxMargin"]')?.value) || 0;
        const minWidth = parseFloat(document.querySelector('[data-field="minWidth"]')?.value) || 320;
        const maxWidth = parseFloat(document.querySelector('[data-field="maxWidth"]')?.value) || 1920;

        const format = document.querySelector('input[name="format"]:checked').value;
        const inputUnit = document.querySelector('input[name="inputUnit"]:checked').value;
        const outputUnit = document.querySelector('input[name="outputUnit"]:checked').value;
        const enableRounding = roundingCheckbox.checked;

        if (minPadding === 0 && maxPadding === 0 && minMargin === 0 && maxMargin === 0) {
            resultElement.textContent = 'Введите значения для генерации кода';
            return;
        }

        let cssCode = '';

        if (format === 'tailwind') {
            // Генерация для Tailwind CSS - кастомные значения
            if (minPadding !== 0 || maxPadding !== 0) {
                const paddingClamp = calculateClamp(minPadding, maxPadding, minWidth, maxWidth, inputUnit, outputUnit, enableRounding);
                
                // Получаем выбранное направление для padding
                const selectedPaddingDirection = document.querySelector('input[name="paddingDirection"]:checked').value;
                
                // Генерируем только выбранное направление
                cssCode += `${selectedPaddingDirection}-[${paddingClamp}]\n`;
            }

            if (minMargin !== 0 || maxMargin !== 0) {
                const marginClamp = calculateClamp(minMargin, maxMargin, minWidth, maxWidth, inputUnit, outputUnit, enableRounding);
                
                // Получаем выбранное направление для margin
                const selectedMarginDirection = document.querySelector('input[name="marginDirection"]:checked').value;
                
                // Генерируем только выбранное направление
                cssCode += `${selectedMarginDirection}-[${marginClamp}]\n`;
            }
        } else {
            // Генерация для нативного CSS
            if (minPadding !== 0 || maxPadding !== 0) {
                const paddingClamp = calculateClamp(minPadding, maxPadding, minWidth, maxWidth, inputUnit, outputUnit, enableRounding);
                
                // Если результат - простое значение (не clamp), генерируем только основной класс
                if (!paddingClamp.includes('clamp(')) {
                    cssCode += `.adaptive-padding {\n  padding: ${paddingClamp};\n}\n\n`;
                } else {
                    cssCode += `.adaptive-padding {\n  padding: ${paddingClamp};\n}\n\n`;
                    cssCode += `.adaptive-padding-x {\n  padding-left: ${paddingClamp};\n  padding-right: ${paddingClamp};\n}\n\n`;
                    cssCode += `.adaptive-padding-y {\n  padding-top: ${paddingClamp};\n  padding-bottom: ${paddingClamp};\n}\n\n`;
                }
            }

            if (minMargin !== 0 || maxMargin !== 0) {
                const marginClamp = calculateClamp(minMargin, maxMargin, minWidth, maxWidth, inputUnit, outputUnit, enableRounding);
                
                // Если результат - простое значение (не clamp), генерируем только основной класс
                if (!marginClamp.includes('clamp(')) {
                    cssCode += `.adaptive-margin {\n  margin: ${marginClamp};\n}\n\n`;
                } else {
                    cssCode += `.adaptive-margin {\n  margin: ${marginClamp};\n}\n\n`;
                    cssCode += `.adaptive-margin-x {\n  margin-left: ${marginClamp};\n  margin-right: ${marginClamp};\n}\n\n`;
                    cssCode += `.adaptive-margin-y {\n  margin-top: ${marginClamp};\n  margin-bottom: ${marginClamp};\n}\n\n`;
                }
            }
        }

        resultElement.textContent = cssCode.trim();
    }

    // Обработчики событий
    inputs.forEach(input => {
        input.addEventListener('input', generateCode);
    });

    formatRadios.forEach(radio => {
        radio.addEventListener('change', generateCode);
    });

    inputUnitRadios.forEach(radio => {
        radio.addEventListener('change', generateCode);
    });

    outputUnitRadios.forEach(radio => {
        radio.addEventListener('change', generateCode);
    });

    roundingCheckbox.addEventListener('change', generateCode);

    paddingDirectionRadios.forEach(radio => {
        radio.addEventListener('change', generateCode);
    });

    marginDirectionRadios.forEach(radio => {
        radio.addEventListener('change', generateCode);
    });

    // Копирование в буфер обмена
    resultElement.addEventListener('click', function() {
        if (resultElement.textContent && resultElement.textContent !== 'Введите значения для генерации кода') {
            navigator.clipboard.writeText(resultElement.textContent).then(() => {
                toast.style.display = 'block';
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 2000);
            });
        }
    });

    // Генерация при загрузке страницы
    generateCode();
});
