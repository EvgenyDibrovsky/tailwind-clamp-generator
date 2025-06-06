function generateClamp() {
    const unit = document.querySelector('input[name="unit"]:checked').value;
    const round = document.getElementById("rounding").checked;

    let min = parseFloat(document.getElementById("minSize").value);
    let max = parseFloat(document.getElementById("maxSize").value);
    let minWidth = parseFloat(document.getElementById("minWidth").value);
    let maxWidth = parseFloat(document.getElementById("maxWidth").value);

    if (unit === 'rem') {
        min = min * 16;
        max = max * 16;
    }

    if (isNaN(min) || isNaN(max) || isNaN(minWidth) || isNaN(maxWidth)) {
        document.getElementById("result").textContent = "Invalid values: input is not a number.";
        return;
    }

    if (min >= max) {
        document.getElementById("result").textContent = "Invalid values: min must be less than max.";
        return;
    }

    if (minWidth >= maxWidth) {
        document.getElementById("result").textContent = "Invalid values: min screen width must be less than max.";
        return;
    }

    const slope = (max - min) / (maxWidth - minWidth);
    let vw = slope * 100;
    let base = min - slope * minWidth;

    if (round) {
        vw = Math.round(vw);
        base = Math.round(base);
    } else {
        vw = vw.toFixed(3);
        base = base.toFixed(2);
    }

    const minRem = Number((min / 16).toFixed(2)).toString();
    const maxRem = Number((max / 16).toFixed(2)).toString();

    const clamp = `clamp(${minRem}rem,${vw}vw+${base}px,${maxRem}rem)`;
    const tailwind = `text-[${clamp}]`;

    document.getElementById("result").textContent = tailwind;
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
    const inputs = document.querySelectorAll('input[type="number"]');
    const radios = document.querySelectorAll('input[type="radio"]');
    const checkbox = document.getElementById('rounding');
    const resultElement = document.getElementById("result");

    inputs.forEach(input => {
        input.addEventListener('input', generateClamp);
    });

    radios.forEach(radio => {
        radio.addEventListener('change', generateClamp);
    });

    checkbox.addEventListener('change', generateClamp);

    resultElement.addEventListener('click', function() {
        if (this.textContent && !this.textContent.includes("Invalid values")) {
            copyToClipboard(this.textContent);
        }
    });

    generateClamp();
}); 