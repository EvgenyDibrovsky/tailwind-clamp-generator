document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.clamp-input');
    const formatRadios = document.querySelectorAll('input[name="format"]');
    const inputUnitRadios = document.querySelectorAll('input[name="inputUnit"]');
    const outputUnitRadios = document.querySelectorAll('input[name="outputUnit"]');
    const spacingTypeRadios = document.querySelectorAll('input[name="spacingType"]');
    const roundingCheckbox = document.querySelector('.rounding-checkbox');
    const resultElement = document.querySelector('.clamp-result');
    const toast = document.getElementById('toast');
    
    // Элементы полей для показа/скрытия
    const paddingFields = document.querySelectorAll('.padding-fields');
    const marginFields = document.querySelectorAll('.margin-fields');

    // Функция для показа/скрытия полей в зависимости от выбранного типа
    function toggleFields() {
        const selectedType = document.querySelector('input[name="spacingType"]:checked').value;
        
        if (selectedType === 'padding') {
            paddingFields.forEach(field => field.style.display = 'block');
            marginFields.forEach(field => field.style.display = 'none');
        } else {
            paddingFields.forEach(field => field.style.display = 'none');
            marginFields.forEach(field => field.style.display = 'block');
        }
    }

    // Функция для расчета clamp значения
    function calculateClamp(minValue, maxValue, minWidth, maxWidth, inputUnit, outputUnit, enableRounding) {
        // Если значения одинаковые, возвращаем простое значение в единицах вывода
        if (minValue === maxValue) {
            let valueOut = minValue;
            if (inputUnit !== outputUnit) {
                if (inputUnit === 'px' && outputUnit === 'rem') valueOut = minValue / 16;
                if (inputUnit === 'rem' && outputUnit === 'px') valueOut = minValue * 16;
            }
            if (enableRounding) valueOut = Math.round(valueOut * 1000) / 1000;
            const unit = outputUnit === 'rem' ? 'rem' : 'px';
            return `${valueOut}${unit}`;
        }

        // Конвертируем значения в пиксели для расчетов
        let minPx = inputUnit === 'px' ? minValue : minValue * 16;
        let maxPx = inputUnit === 'px' ? maxValue : maxValue * 16;

        // Рассчитываем slope и intercept
        // Если диапазон ширины нулевой, используем среднее значение без вычисления наклона
        if (maxWidth === minWidth) {
            const unit = outputUnit === 'rem' ? 'rem' : 'px';
            let avgValue = (minValue + maxValue) / 2;
            if (inputUnit !== outputUnit) {
                if (inputUnit === 'px' && outputUnit === 'rem') avgValue = avgValue / 16;
                if (inputUnit === 'rem' && outputUnit === 'px') avgValue = avgValue * 16;
            }
            if (enableRounding) avgValue = Math.round(avgValue * 1000) / 1000;
            return `${avgValue}${unit}`;
        }

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
            let avgValue = (minValue + maxValue) / 2; // пока в inputUnit
            // Конвертация среднего в единицы вывода
            if (inputUnit !== outputUnit) {
                if (inputUnit === 'px' && outputUnit === 'rem') avgValue = avgValue / 16;
                if (inputUnit === 'rem' && outputUnit === 'px') avgValue = avgValue * 16;
            }
            if (enableRounding) avgValue = Math.round(avgValue * 1000) / 1000;
            return `${avgValue}${unit}`;
        }

        const unit = outputUnit === 'rem' ? 'rem' : 'px';
        
        // Конвертируем min и max значения в outputUnit если нужно
        let minValueOutput = minValue;
        let maxValueOutput = maxValue;
        
        if (inputUnit !== outputUnit) {
            if (inputUnit === 'px' && outputUnit === 'rem') {
                minValueOutput = minValue / 16;
                maxValueOutput = maxValue / 16;
            } else if (inputUnit === 'rem' && outputUnit === 'px') {
                minValueOutput = minValue * 16;
                maxValueOutput = maxValue * 16;
            }
        }
        
        // Применяем округление к min и max значениям если включено
        if (enableRounding) {
            minValueOutput = Math.round(minValueOutput * 1000) / 1000;
            maxValueOutput = Math.round(maxValueOutput * 1000) / 1000;
        }
        
        return `clamp(${minValueOutput}${unit}, ${interceptValue}${unit} + ${slopeValue}${unit} * 100vw, ${maxValueOutput}${unit})`;
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

        const spacingType = document.querySelector('input[name="spacingType"]:checked')?.value || 'padding';

        if (format === 'tailwind') {
            // Генерация для Tailwind CSS
            if (spacingType === 'padding' && (minPadding !== 0 || maxPadding !== 0)) {
                const paddingClamp = calculateClamp(minPadding, maxPadding, minWidth, maxWidth, inputUnit, outputUnit, enableRounding);
                cssCode += `p-[${paddingClamp}]\n`;
            }

            if (spacingType === 'margin' && (minMargin !== 0 || maxMargin !== 0)) {
                const marginClamp = calculateClamp(minMargin, maxMargin, minWidth, maxWidth, inputUnit, outputUnit, enableRounding);
                cssCode += `m-[${marginClamp}]\n`;
            }
        } else {
            // Генерация для нативного CSS
            if (spacingType === 'padding' && (minPadding !== 0 || maxPadding !== 0)) {
                const paddingClamp = calculateClamp(minPadding, maxPadding, minWidth, maxWidth, inputUnit, outputUnit, enableRounding);
                
                // Если результат - простое значение (не clamp), генерируем только основной класс
                if (!paddingClamp.includes('clamp(')) {
                    cssCode += `.adaptive-padding {\n  padding: ${paddingClamp};\n}\n\n`;
                } else {
                    cssCode += `.adaptive-padding {\n  padding: ${paddingClamp};\n}\n\n`;
                }
            }

            if (spacingType === 'margin' && (minMargin !== 0 || maxMargin !== 0)) {
                const marginClamp = calculateClamp(minMargin, maxMargin, minWidth, maxWidth, inputUnit, outputUnit, enableRounding);
                
                // Если результат - простое значение (не clamp), генерируем только основной класс
                if (!marginClamp.includes('clamp(')) {
                    cssCode += `.adaptive-margin {\n  margin: ${marginClamp};\n}\n\n`;
                } else {
                    cssCode += `.adaptive-margin {\n  margin: ${marginClamp};\n}\n\n`;
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

    spacingTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleFields();
            generateCode();
        });
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

    // Инициализация при загрузке страницы
    toggleFields();
    generateCode();
});
