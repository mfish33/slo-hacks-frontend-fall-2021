import { useEffect, useRef, useState } from "react";

interface AutoCompleteProps {
    suggestions:string[],
    onResult:(result:string) => void,
    placeholder:string
}

export function AutoComplete({suggestions, onResult, placeholder}:AutoCompleteProps) {
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [input, setInput] = useState('');
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

    const dropDownRef = useRef<HTMLUListElement>()

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value;
    
        // Filter our suggestions that don't contain the user's input
        let unLinked = suggestions.filter(
          (suggestion) =>
            suggestion.toLowerCase().includes(userInput.toLowerCase())
        );

        if(unLinked.length > 5) {
            unLinked = unLinked.slice(0,5)
        }
    
        setInput(e.target.value);
        setActiveSuggestionIndex(0);
        setFilteredSuggestions(unLinked);
        setShowSuggestions(true);
    };

    const onClick = (e:any) => {
        setFilteredSuggestions([]);
        setInput(e.target.innerText);
        onResult(e.target.innerText)
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);
    };

    const unFocus = () => {
        // Use delay to allow for clicking
        setTimeout(() => {
            setShowSuggestions(false);
            setActiveSuggestionIndex(0);
        }, 500)
    }

    const onKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        switch(e.code) {
            case 'ArrowUp':
                if(activeSuggestionIndex != 0) {
                    setActiveSuggestionIndex(activeSuggestionIndex-1)   
                }
            return
            case 'ArrowDown':
                setActiveSuggestionIndex(activeSuggestionIndex + 1)
                console.log(dropDownRef.current?.scrollTop, dropDownRef.current?.scrollLeft)
                // dropDownRef.current!.scrollTop = 25
            return
            case 'Enter':
                setShowSuggestions(false)
                setActiveSuggestionIndex(0)
                setInput(filteredSuggestions[activeSuggestionIndex])
                onResult(filteredSuggestions[activeSuggestionIndex])
            return
        }
    }

    const SuggestionsListComponent = () => {
        return filteredSuggestions.length ? (
            
            <ul 
                className="suggestions w-full bg-white border list-none mt-0 pl-0 z-50 relative" 
                style={{zIndex:100}} 
                ref={dropDownRef as any} 
            >
                {filteredSuggestions.map((suggestion, index) => {
                return (
                    <li 
                        className={`z-50 ${activeSuggestionIndex == index ? 'bg-blue-400 text-white' : ''}`} 
                        onMouseEnter={() => setActiveSuggestionIndex(index)} 
                        style={{zIndex:100}} 
                        key={suggestion} 
                        onClick={onClick}
                    >
                    {suggestion}
                    </li>
                );
                })}
            </ul>
            ) : (
          <div className="no-suggestions">
            
          </div>
        );
      };

      return (
        <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          <input
            className="border-2 border-black p-2 w-full h-8 rounded"
            type="text"
            placeholder={placeholder}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={unFocus}
            value={input}
          />
          <div className="absolute left-0 right-0">
            {showSuggestions && input && <SuggestionsListComponent />}
          </div>
        </div>
      );
}