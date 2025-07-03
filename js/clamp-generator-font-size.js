function toggleOutputUnit() {
    const format = document.querySelector('input[name="format"]:checked').value;
    const outputUnitGroup = document.querySelector('.output-unit-group');
    
    if (format === 'tailwind') {
        outputUnitGroup.style.display = 'none';
        // Set rem as default for Tailwind
        document.querySelector('input[name="outputUnit"][value="rem"]').checked = true;
    } else {
        outputUnitGroup.style.display = 'block';
    }
}

function generateClamp() {
    const format = document.querySelector('input[name="format"]:checked').value;
    const inputUnit = document.querySelector('input[name="inputUnit"]:checked').value;
    const outputUnit = document.querySelector('input[name="outputUnit"]:checked').value;
    const round = document.querySelector(".rounding-checkbox").checked;

    let min = parseFloat(document.querySelector('.clamp-input[data-field="minSize"]').value);
    let max = parseFloat(document.querySelector('.clamp-input[data-field="maxSize"]').value);
    let minWidth = parseFloat(document.querySelector('.clamp-input[data-field="minWidth"]').value);
    let maxWidth = parseFloat(document.querySelector('.clamp-input[data-field="maxWidth"]').value);

    // Convert input values to pixels for calculations
    if (inputUnit === 'rem') {
        min = min * 16;
        max = max * 16;
    }

    if (isNaN(min) || isNaN(max) || isNaN(minWidth) || isNaN(maxWidth)) {
        document.querySelector(".clamp-result").textContent = "Invalid values: input is not a number.";
        return;
    }

    if (min >= max) {
        document.querySelector(".clamp-result").textContent = "Invalid values: min must be less than max.";
        return;
    }

    if (minWidth >= maxWidth) {
        document.querySelector(".clamp-result").textContent = "Invalid values: min screen width must be less than max.";
        return;
    }

    const slope = (max - min) / (maxWidth - minWidth);
    let vw = slope * 100;
    let base = min - slope * minWidth;

    if (base < 0) {
        base = 0;
    }

    if (round) {
        vw = Math.round(vw);
        base = Math.round(base);
    } else {
        vw = vw.toFixed(3);
        base = base.toFixed(2);
    }

    let result;
    
    if (format === 'tailwind') {
        // For Tailwind, always use rem for min/max values
        const minRem = round ? Number((min / 16).toFixed(2)) : Number((min / 16).toFixed(3));
        const maxRem = round ? Number((max / 16).toFixed(2)) : Number((max / 16).toFixed(3));
        const clamp = `clamp(${minRem}rem,${vw}vw+${base}px,${maxRem}rem)`;
        result = `text-[${clamp}]`;
    } else {
        // Native CSS format
        if (outputUnit === 'rem') {
            const minRem = round ? Number((min / 16).toFixed(2)) : Number((min / 16).toFixed(3));
            const maxRem = round ? Number((max / 16).toFixed(2)) : Number((max / 16).toFixed(3));
            const baseRem = round ? Number((base / 16).toFixed(2)) : Number((base / 16).toFixed(3));
            result = `font-size: clamp(${minRem}rem, calc(${vw}vw + ${baseRem}rem), ${maxRem}rem);`;
        } else {
            // px output
            const minPx = round ? Math.round(min) : min;
            const maxPx = round ? Math.round(max) : max;
            result = `font-size: clamp(${minPx}px, calc(${vw}vw + ${base}px), ${maxPx}px);`;
        }
    }

    document.querySelector(".clamp-result").textContent = result;
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast();
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.clamp-input');
    const radios = document.querySelectorAll('input[type="radio"]');
    const checkbox = document.querySelector('.rounding-checkbox');
    const resultElement = document.querySelector(".clamp-result");

    inputs.forEach(input => {
        input.addEventListener('input', generateClamp);
    });

    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (radio.name === 'format') {
                toggleOutputUnit();
            }
            generateClamp();
        });
    });

    checkbox.addEventListener('change', generateClamp);

    resultElement.addEventListener('click', function() {
        if (this.textContent && !this.textContent.includes("Invalid values")) {
            copyToClipboard(this.textContent);
        }
    });

    // Initialize on page load
    toggleOutputUnit();
    generateClamp();
}); 