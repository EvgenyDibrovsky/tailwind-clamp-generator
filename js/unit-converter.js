function convertValue() {
    const direction = document.querySelector('input[name="direction"]:checked').value;
    const inputValue = parseFloat(document.querySelector('.converter-input').value);
    const resultElement = document.querySelector('.converter-result');

    if (isNaN(inputValue)) {
        resultElement.textContent = 'Enter a valid number';
        resultElement.classList.remove('clickable');
        return;
    }

    let result;
    if (direction === 'px-to-rem') {
        result = (inputValue / 16).toFixed(3);
        // Remove trailing zeros
        const remValue = parseFloat(result);
        if (remValue === Math.round(remValue)) {
            resultElement.textContent = `${Math.round(remValue)}rem`;
        } else {
            // Remove trailing zeros from decimal part
            resultElement.textContent = `${remValue}rem`;
        }
    } else {
        result = (inputValue * 16).toFixed(1);
        // Remove .0 if the result is a whole number
        const pxValue = parseFloat(result);
        if (pxValue === Math.round(pxValue)) {
            resultElement.textContent = `${Math.round(pxValue)}px`;
        } else {
            resultElement.textContent = `${result}px`;
        }
    }

    resultElement.classList.add('clickable');
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
    const inputElement = document.querySelector('.converter-input');
    const radios = document.querySelectorAll('input[name="direction"]');
    const resultElement = document.querySelector('.converter-result');

    // Input event listener
    inputElement.addEventListener('input', convertValue);

    // Radio button event listeners
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Clear input and result when switching direction
            inputElement.value = '';
            resultElement.textContent = 'Enter a value to convert';
            resultElement.classList.remove('clickable');
        });
    });

    // Result click to copy
    resultElement.addEventListener('click', function() {
        if (this.classList.contains('clickable') && this.textContent !== 'Enter a value to convert') {
            copyToClipboard(this.textContent);
        }
    });

    // Focus on input when page loads
    inputElement.focus();
}); 