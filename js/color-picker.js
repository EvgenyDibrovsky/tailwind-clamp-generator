// Color Picker JS
class ColorPicker {
    constructor() {
        this.colorCanvas = document.getElementById('colorCanvas');
        this.hueCanvas = document.getElementById('hueCanvas');
        this.colorCursor = document.getElementById('colorCursor');
        this.hueCursor = document.getElementById('hueCursor');
        this.colorDisplay = document.getElementById('colorDisplay');
        
        this.hexInput = document.getElementById('hexInput');
        this.rInput = document.getElementById('rInput');
        this.gInput = document.getElementById('gInput');
        this.bInput = document.getElementById('bInput');
        this.cmykDisplay = document.getElementById('cmykDisplay');
        this.hsvDisplay = document.getElementById('hsvDisplay');
        this.hslDisplay = document.getElementById('hslDisplay');
        
        this.colorCtx = this.colorCanvas.getContext('2d');
        this.hueCtx = this.hueCanvas.getContext('2d');
        
        this.currentHue = 0;
        this.currentSaturation = 100;
        this.currentLightness = 50;
        
        this.isDraggingColor = false;
        this.isDraggingHue = false;
        
        this.init();
    }
    
    init() {
        this.drawHueSlider();
        this.drawColorPalette();
        this.updateColor();
        this.bindEvents();
    }
    
    drawHueSlider() {
        const gradient = this.hueCtx.createLinearGradient(0, 0, 0, this.hueCanvas.height);
        
        // Создаем градиент с цветами радуги
        for (let i = 0; i <= 360; i += 60) {
            gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
        }
        
        this.hueCtx.fillStyle = gradient;
        this.hueCtx.fillRect(0, 0, this.hueCanvas.width, this.hueCanvas.height);
    }
    
    drawColorPalette() {
        const width = this.colorCanvas.width;
        const height = this.colorCanvas.height;
        
        // Очищаем canvas
        this.colorCtx.clearRect(0, 0, width, height);
        
        // Создаем базовый цвет на основе текущего оттенка
        this.colorCtx.fillStyle = `hsl(${this.currentHue}, 100%, 50%)`;
        this.colorCtx.fillRect(0, 0, width, height);
        
        // Добавляем белый градиент слева направо
        const whiteGradient = this.colorCtx.createLinearGradient(0, 0, width, 0);
        whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.colorCtx.fillStyle = whiteGradient;
        this.colorCtx.fillRect(0, 0, width, height);
        
        // Добавляем черный градиент сверху вниз
        const blackGradient = this.colorCtx.createLinearGradient(0, 0, 0, height);
        blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.colorCtx.fillStyle = blackGradient;
        this.colorCtx.fillRect(0, 0, width, height);
    }
    
    bindEvents() {
        // События для палитры цветов
        this.colorCanvas.addEventListener('mousedown', (e) => {
            this.isDraggingColor = true;
            this.handleColorCanvasClick(e);
        });
        
        this.colorCanvas.addEventListener('mousemove', (e) => {
            if (this.isDraggingColor) {
                this.handleColorCanvasClick(e);
            }
        });
        
        // События для слайдера оттенков
        this.hueCanvas.addEventListener('mousedown', (e) => {
            this.isDraggingHue = true;
            this.handleHueCanvasClick(e);
        });
        
        this.hueCanvas.addEventListener('mousemove', (e) => {
            if (this.isDraggingHue) {
                this.handleHueCanvasClick(e);
            }
        });
        
        // Глобальные события для завершения перетаскивания
        document.addEventListener('mouseup', () => {
            this.isDraggingColor = false;
            this.isDraggingHue = false;
        });
        
        // События для RGB полей
        this.rInput.addEventListener('input', () => this.updateFromRGB());
        this.gInput.addEventListener('input', () => this.updateFromRGB());
        this.bInput.addEventListener('input', () => this.updateFromRGB());
        
    }
    
    handleColorCanvasClick(e) {
        const rect = this.colorCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Ограничиваем координаты границами canvas
        const clampedX = Math.max(0, Math.min(x, this.colorCanvas.width));
        const clampedY = Math.max(0, Math.min(y, this.colorCanvas.height));
        
        // Вычисляем насыщенность и яркость
        this.currentSaturation = (clampedX / this.colorCanvas.width) * 100;
        this.currentLightness = 100 - (clampedY / this.colorCanvas.height) * 100;
        
        // Обновляем позицию курсора
        this.colorCursor.style.left = clampedX + 'px';
        this.colorCursor.style.top = clampedY + 'px';
        
        this.updateColor();
    }
    
    handleHueCanvasClick(e) {
        const rect = this.hueCanvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        
        // Ограничиваем координаты границами canvas
        const clampedY = Math.max(0, Math.min(y, this.hueCanvas.height));
        
        // Вычисляем оттенок
        this.currentHue = (clampedY / this.hueCanvas.height) * 360;
        
        // Обновляем позицию курсора
        this.hueCursor.style.top = clampedY + 'px';
        
        // Перерисовываем палитру с новым оттенком
        this.drawColorPalette();
        this.updateColor();
    }
    
    updateColor() {
        // Конвертируем HSL в RGB
        const rgb = this.hslToRgb(this.currentHue, this.currentSaturation, this.currentLightness);
        
        // Обновляем отображение цвета
        this.colorDisplay.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        
        // Обновляем поля ввода
        this.updateInputs(rgb);
        
        // Обновляем отображение других форматов
        this.updateColorFormats(rgb);
    }
    
    updateFromRGB() {
        const r = parseInt(this.rInput.value) || 0;
        const g = parseInt(this.gInput.value) || 0;
        const b = parseInt(this.bInput.value) || 0;
        
        // Ограничиваем значения
        const clampedR = Math.max(0, Math.min(255, r));
        const clampedG = Math.max(0, Math.min(255, g));
        const clampedB = Math.max(0, Math.min(255, b));
        
        // Обновляем поля если значения были изменены
        this.rInput.value = clampedR;
        this.gInput.value = clampedG;
        this.bInput.value = clampedB;
        
        // Конвертируем RGB в HSL
        const hsl = this.rgbToHsl(clampedR, clampedG, clampedB);
        this.currentHue = hsl.h;
        this.currentSaturation = hsl.s;
        this.currentLightness = hsl.l;
        
        // Обновляем курсоры
        this.updateCursors();
        
        // Перерисовываем палитру
        this.drawColorPalette();
        
        // Обновляем отображение
        const rgb = { r: clampedR, g: clampedG, b: clampedB };
        this.colorDisplay.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.hexInput.value = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        this.updateColorFormats(rgb);
    }
    
    updateCursors() {
        // Обновляем позицию курсора на палитре
        const colorX = (this.currentSaturation / 100) * this.colorCanvas.width;
        const colorY = ((100 - this.currentLightness) / 100) * this.colorCanvas.height;
        this.colorCursor.style.left = colorX + 'px';
        this.colorCursor.style.top = colorY + 'px';
        
        // Обновляем позицию курсора на слайдере оттенков
        const hueY = (this.currentHue / 360) * this.hueCanvas.height;
        this.hueCursor.style.top = hueY + 'px';
    }
    
    updateInputs(rgb) {
        this.hexInput.value = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        this.rInput.value = rgb.r;
        this.gInput.value = rgb.g;
        this.bInput.value = rgb.b;
    }
    
    updateColorFormats(rgb) {
        // CMYK
        const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);
        this.cmykDisplay.textContent = `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`;
        
        // HSV
        const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
        this.hsvDisplay.textContent = `${hsv.h}°, ${hsv.s}%, ${hsv.v}%`;
        
        // HSL
        this.hslDisplay.textContent = `${Math.round(this.currentHue)}°, ${Math.round(this.currentSaturation)}%, ${Math.round(this.currentLightness)}%`;
    }
    
    // Утилиты для конвертации цветов
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (0 <= h && h < 1/6) {
            r = c; g = x; b = 0;
        } else if (1/6 <= h && h < 2/6) {
            r = x; g = c; b = 0;
        } else if (2/6 <= h && h < 3/6) {
            r = 0; g = c; b = x;
        } else if (3/6 <= h && h < 4/6) {
            r = 0; g = x; b = c;
        } else if (4/6 <= h && h < 5/6) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;
        
        if (diff !== 0) {
            s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
            
            switch (max) {
                case r:
                    h = (g - b) / diff + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / diff + 2;
                    break;
                case b:
                    h = (r - g) / diff + 4;
                    break;
            }
            h /= 6;
        }
        
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }
    
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    rgbToCmyk(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const k = 1 - Math.max(r, g, b);
        const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
        const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
        const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
        
        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }
    
    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        let h = 0;
        const s = max === 0 ? 0 : diff / max;
        const v = max;
        
        if (diff !== 0) {
            switch (max) {
                case r:
                    h = (g - b) / diff + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / diff + 2;
                    break;
                case b:
                    h = (r - g) / diff + 4;
                    break;
            }
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }
    
}

// Инициализируем колор пикер после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new ColorPicker();
});