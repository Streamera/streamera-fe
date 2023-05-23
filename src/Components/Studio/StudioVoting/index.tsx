import '../styles.scss'
import { StudioVotingParam } from './types';
import dayjs from 'dayjs';

const Component = ({
    text,
    color,
    bgColor,
    theme,
    total,
    choices,
    endAt,
    isPreview,
}: StudioVotingParam) => {
    
    const Cyberpunk = () => {
        return (     
                        
            <div className="theme-component cyberpunk voting">
                <section className="container">
                    <div className="card-container">
                        <div className="card-content">
                            <div className="card-title">
                                <span className="title">{text}</span>
                            </div>
                            <div className="card-body">
                                <div className="row w-100">
                                    {
                                        choices.map((x, index) => (
                                            <>
                                                <div className="col-6 text-left" key={`voting-option-${index}`}>{x.option}</div>
                                                <div className="col-6 text-right" key={`voting-value-${index}`}>${(x.total ?? 0).toFixed(2)}</div>
                                            </>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="card-footer">
                                <span className="title">
                                    <div className="row" style={{fontSize: 12}}>
                                        <div className="col-6 text-left" style={{fontSize: 10}}><span>{dayjs(endAt).format('YYYY-MM-DD HH:mm:ss')}</span></div>
                                        <div className="col-6 text-right">Total: ${(total ?? 0).toFixed(2)}</div>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    const Regal = () => {
        return (

            <div className="theme-component regal voting">
                <div className="card">
                    <div className="content">
                        <div className="back">
                            <div className="back-content">
                                <div className="p-3 h-100 w-100 d-flex flex-column justify-content-between">
                                    <strong>{text}</strong>
                                    <div className="row mt-3 text-center">
                                        {
                                            choices.map((x, index) => (
                                                <>
                                                    <div className="col-6 text-left" key={`voting-option-${index}`}>{x.option}</div>
                                                    <div className="col-6 text-right" key={`voting-value-${index}`}>${(x.total ?? 0).toFixed(2)}</div>
                                                </>
                                            ))
                                        }
                                    </div>
                                    <div className="row" style={{fontSize: 12}}>
                                        <div className="col-6 d-flex align-items-end justify-content-start">{dayjs(endAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                                        <div className="col-6 text-right">Total: ${(total ?? 0).toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const Rainbow = () => {
        return (
            <div className="theme-component rainbow voting mt-3 m-auto">
                <div className="card">
                    <div className="bg uwu"></div>
                    <div className="bg"></div>
                    <div className="content">
                        <div className="p-3 h-100 w-100 d-flex flex-column justify-content-between">
                            <strong>{text}</strong>
                            <div className="row mt-3 text-center">
                                {
                                    choices.map((x, index) => (
                                        <>
                                            <div className="col-6 text-left" key={`voting-option-${index}`}>{x.option}</div>
                                            <div className="col-6 text-right" key={`voting-value-${index}`}>${(x.total ?? 0).toFixed(2)}</div>
                                        </>
                                    ))
                                }
                            </div>
                            <div className="row" style={{fontSize: 12}}>
                                <div className="col-6 d-flex align-items-end justify-content-start">{dayjs(endAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                                <div className="col-6 text-right">Total: ${(total ?? 0).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const None = () => {
        if(isPreview) {
            return (
                <div className="video-frame center">
                    <div className="voting-container" style={{ color: color, backgroundColor: bgColor, }}>
                        <span>{text}</span>
                        <div className="row" style={{ width: 350 }}>
                            {
                                choices.map((x, index) => (
                                    <>
                                        <div className="col-6 text-left" key={`voting-option-${index}`}>{x.option}</div>
                                        <div className="col-6 text-right" key={`voting-value-${index}`}>$0.00</div>
                                    </>
                                ))
                            }
                        </div>
                        <div className="row">
                            <div className="col-6 d-flex align-items-end justify-content-start">{dayjs(endAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                            <div className="col-6 text-right">Total: ${(total ?? 0).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <>
                <strong>{text ?? ""}</strong>
                <div>
                    {
                        choices &&
                        choices.map((x, index) => (
                            <div className={'row'} key={`poll-option-${index}-${text}`}>
                                <div className="col-6 text-left">{x.option}</div>
                                <div className="col-6 text-right">${(x.total ?? 0).toFixed(2)}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="row">
                    <div className="col-6 d-flex align-items-end justify-content-start" style={{ fontSize: 12 }}>{dayjs(endAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                    <div className="col-6 text-right">Total: ${(total ?? 0).toFixed(2)}</div>
                </div>
            </>
        )
    }

    const Main = () => {
        switch(theme) {
            case "none":
                return <None />;
            case "cyberpunk":
                return <Cyberpunk />;
            case "regal":
                return <Regal />;
            case "rainbow":
                return <Rainbow />;
            default:
                return null;
        }
    }

    return <Main />;
}

export default Component;