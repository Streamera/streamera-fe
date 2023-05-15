import { ChangeEvent, useCallback, useState } from 'react';
import './styles.scss'
import { OverlayButtonType } from './types';
import Marquee from 'react-fast-marquee';

const Page = () => {
    const [ activeTab, setActiveTab ] = useState<OverlayButtonType>("announcement");
    const [ color, setColor ] = useState<string>("#000000");
    const [ backgroundColor, setBackgroundColor ] = useState<string>("#ffffff");
    const [ displayText, setDisplayText ] = useState<string>("Sample Text");
    const [ textSpeed, setTextSpeed ] = useState<number>(100);

    const onColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    }, []);

    const onBackgroundColorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setBackgroundColor(e.target.value);
    }, []);

    const onTextSpeedChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let speed = parseInt(e.target.value);

        if(isNaN(speed)) {
            speed = 100;
        }
        setTextSpeed(speed);
    }, []);

    const onDisplayTextchange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDisplayText(e.target.value);
    }, []);

    return (
        <div className='overlay-page'>
            <div className="nav-container">
                <button className={activeTab === 'announcement'? 'active' : ''} onClick={() => setActiveTab('announcement')}>Announcement</button>
                <button className={activeTab === 'notification'? 'active' : ''} onClick={() => setActiveTab('notification')}>Notification</button>
                <button className={activeTab === 'leaderboard'? 'active' : ''} onClick={() => setActiveTab('leaderboard')}>Leaderboard</button>
                <button className={activeTab === 'milestone'? 'active' : ''} onClick={() => setActiveTab('milestone')}>Milestone</button>
                <button className={activeTab === 'voting'? 'active' : ''} onClick={() => setActiveTab('voting')}>Voting</button>
                <button className={activeTab === 'qrcode'? 'active' : ''} onClick={() => setActiveTab('qrcode')}>QR Code</button>
            </div>
            
            <div className="main-content">
                <strong>Announcement</strong>
                <div className="video-frame">
                    <Marquee
                        style={{
                            color,
                            backgroundColor,
                            borderTopLeftRadius: 'inherit',
                            borderTopRightRadius: 'inherit',
                        }}
                        speed={textSpeed}
                    >
                        <div className="marquee-text">
                            {displayText}
                        </div>
                    </Marquee>
                </div>
                <div className="d-flex align-items-center mt-3 w-100">
                    <strong className='mr-2'>Text Color</strong>
                    <input type="color" value={color} onChange={onColorChange}/>
                    <strong className='ml-5 mr-2'>Background Color</strong>
                    <input type="color" value={backgroundColor} onChange={onBackgroundColorChange}/>
                    <strong className='ml-5 mr-2'>Text Speed</strong>
                    <input type="decimal" step={1} className='form-control' style={{ maxWidth: 100 }} value={textSpeed} onChange={onTextSpeedChange}/>
                </div>
                <div className="d-flex flex-column mt-4 align-items-start w-100">
                    <strong>Display Text</strong>
                    <input type="text" className='form-control mt-1' value={displayText} onChange={onDisplayTextchange}/>
                </div>
                <div className="button-container">
                    <button className='save'>Save</button>
                </div>
            </div>
        </div>
    );
}

export default Page;