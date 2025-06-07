import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';

interface PlateInputProps {
  length: number;
  onChange: (plate: string) => void;
  initialChars?: string[]; // For pre-filling from mockup
  name?: string;
}

const PlateInput: React.FC<PlateInputProps> = ({ length, onChange, initialChars = [], name }) => {
  const [plateChars, setPlateChars] = useState<string[]>(() => {
    const initial = new Array(length).fill('');
    if (initialChars && initialChars.length > 0) {
      for (let i = 0; i < Math.min(length, initialChars.length); i++) {
        initial[i] = initialChars[i].toUpperCase();
      }
    }
    return initial;
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const processChange = (newChars: string[]) => {
    setPlateChars(newChars);
    onChange(newChars.join(''));
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.toUpperCase();
    const newPlateChars = [...plateChars];

    if (value === '' || /^[A-Z0-9]$/.test(value)) {
      newPlateChars[index] = value;
      processChange(newPlateChars);

      if (value && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value.length > 1) { // Handle paste of multiple characters into one box
      const firstValidChar = value.split('').find(char => /^[A-Z0-9]$/.test(char)) || '';
      newPlateChars[index] = firstValidChar;
      processChange(newPlateChars);
      if (firstValidChar && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newPlateChars = [...plateChars];
      if (newPlateChars[index] === '' && index > 0 && inputRefs.current[index - 1]) {
        newPlateChars[index - 1] = ''; // Also clear previous if current is already empty
        inputRefs.current[index - 1]?.focus();
      } else {
        newPlateChars[index] = '';
      }
      processChange(newPlateChars);
      // Default behavior might handle focus correctly if input becomes empty
      // If not, manually focus previous on backspace if current becomes empty and not first
      if(newPlateChars[index] === '' && index > 0 && e.currentTarget.value === '' && inputRefs.current[index - 1]){
         inputRefs.current[index - 1]?.focus();
      }

    } else if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, startIndex: number) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newPlateChars = [...plateChars];
    let currentPastedIndex = 0;
    let lastFocusedIndex = startIndex;

    for (let i = startIndex; i < length && currentPastedIndex < pastedText.length; i++) {
      newPlateChars[i] = pastedText[currentPastedIndex];
      currentPastedIndex++;
      lastFocusedIndex = i;
    }
    processChange(newPlateChars);

    if (inputRefs.current[lastFocusedIndex]) {
        if (lastFocusedIndex < length - 1 && pastedText.length > (lastFocusedIndex - startIndex +1)) {
             inputRefs.current[lastFocusedIndex + 1]?.focus();
        } else {
            inputRefs.current[lastFocusedIndex]?.focus();
        }
    }
  };

  return (
    <div className="flex justify-center space-x-1.5 sm:space-x-2" data-testid={name}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          name={`${name}-char${index}`}
          className="w-9 h-11 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold border border-neutral-300 rounded-md bg-neutral-100 focus:bg-white focus:border-[#FDB813] focus:ring-1 focus:ring-[#FDB813] outline-none placeholder-neutral-400 uppercase"
          maxLength={1}
          value={plateChars[index] || ''}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={(e) => e.target.select()}
          onPaste={(e) => handlePaste(e, index)}
          ref={(el) => { inputRefs.current[index] = el; }}
        />
      ))}
    </div>
  );
};

export default PlateInput;