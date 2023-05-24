import { useEffect, useRef, useState } from 'react';
import { OverlayPosition } from '../../types';
import './styles.scss';
import { runIfFunction } from '../../common/utils';

const Component = ({ value, onChange } : { value?: OverlayPosition; onChange?: (position: OverlayPosition) => void; }) => {
    const [ position, setPosition ] = useState<OverlayPosition>("middle-center");
    const hasChanged = useRef(false);

    useEffect(() => {
        if(hasChanged.current) {
            return;
        }

        hasChanged.current = true;
        
        if(!value) {
            return;
        }

        setPosition(value);
    }, [value]);

    useEffect(() => {
        runIfFunction(onChange, position);
    }, [ position, onChange ]);
    
    return (
        <div className="position-input">
            <button onClick={() => setPosition("top-left")} className={position === "top-left"? 'active' : ''}></button>
            <button onClick={() => setPosition("top-center")} className={position === "top-center"? 'active' : ''}></button>
            <button onClick={() => setPosition("top-right")} className={position === "top-right"? 'active' : ''}></button>
            <button onClick={() => setPosition("middle-left")} className={position === "middle-left"? 'active' : ''}></button>
            <button onClick={() => setPosition("middle-center")} className={position === "middle-center"? 'active' : ''}></button>
            <button onClick={() => setPosition("middle-right")} className={position === "middle-right"? 'active' : ''}></button>
            <button onClick={() => setPosition("bottom-left")} className={position === "bottom-left"? 'active' : ''}></button>
            <button onClick={() => setPosition("bottom-center")} className={position === "bottom-center"? 'active' : ''}></button>
            <button onClick={() => setPosition("bottom-right")} className={position === "bottom-right"? 'active' : ''}></button>
        </div>
    )
}

export default Component;