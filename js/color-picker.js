// Color Picker JS
class ColorPicker {
    constructor() {
        this.colorCanvas = document.getElementById('colorCanvas');
        this.hueCanvas = document.getElementById('hueCanvas');
        this.colorCursor = document.getElementById('colorCursor');
        this.hueCursor = document.getElementById('hueCursor');
        this.colorDisplay = document.getElementById('colorDisplay');
        
        this.hexInput = document.getElementById('hexInput');
        this.rgbDisplay = document.getElementById('rgbDisplay');
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
        this.rgbDisplay.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
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
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
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
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = Math.round(n).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return "#" + toHex(r) + toHex(g) + toHex(b);
    }
    
    rgbToCmyk(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const k = 1 - Math.max(r, g, b);
        
        if (k === 1) {
            return { c: 0, m: 0, y: 0, k: 100 };
        }
        
        const c = (1 - r - k) / (1 - k);
        const m = (1 - g - k) / (1 - k);
        const y = (1 - b - k) / (1 - k);
        
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
                    h = ((g - b) / diff) % 6;
                    break;
                case g:
                    h = (b - r) / diff + 2;
                    break;
                case b:
                    h = (r - g) / diff + 4;
                    break;
            }
            h = h * 60;
            if (h < 0) h += 360;
        }
        
        return {
            h: Math.round(h),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }
    
}

// Инициализируем колор пикер после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new ColorPicker();
});