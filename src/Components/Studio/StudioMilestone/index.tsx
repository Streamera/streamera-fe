import { Progress } from 'antd';
import '../styles.scss'
import { StudioMilestoneParam } from './types';

const Component = ({
    text,
    color,
    bgColor,
    progressColor,
    progressBgColor,
    progress,
    theme,
    target,
    current,
    isPreview
}: StudioMilestoneParam) => {
    
    const Cyberpunk = () => {
        return (           
            <div className="theme-component cyberpunk milestone">
                <section className="container">
                    <div className="card-container">
                        <div className="card-content">
                            <div className="card-title">
                                <span className="title">{text}</span>
                            </div>
                            <div className="card-footer">
                                <Progress
                                    percent={progress}
                                    trailColor={progressColor}
                                    strokeColor={progressBgColor}
                                    showInfo={false}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    const Regal = () => {
        return (
                        
            <div className="theme-component regal milestone">
                <div className="card">
                    <div className="content">
                        <div className="back">
                            <div className="back-content">
                                <div className="p-3 w-100">
                                    <strong>{text}</strong>
                                    <Progress
                                        percent={progress}
                                        trailColor={progressColor}
                                        strokeColor={progressBgColor}
                                        showInfo={false}
                                    />
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

            <div className="theme-component rainbow milestone mt-3 m-auto">
                <div className="card">
                    <div className="bg uwu"></div>
                    <div className="bg"></div>
                    <div className="content">
                        <div className="p-3 w-100">
                            <strong>{text}</strong>
                            <Progress
                                percent={progress}
                                trailColor={progressColor}
                                strokeColor={progressBgColor}
                                showInfo={false}
                            />
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
                    <div 
                        className="milestone-container" 
                        style={{ 
                            color, 
                            backgroundColor: bgColor,
                            width: 350
                        }}>
                        <span style={{marginBottom: 10}}>{text}</span>
                        <Progress
                            percent={progress}
                            trailColor={progressColor}
                            strokeColor={progressBgColor}
                            showInfo={false}
                        />
                        <span>{current ?? 0} / {target}</span>
                    </div>
                </div>
            )
        }
        return (
            <>
                <span style={{marginBottom: 10}}>{text}</span>
                <Progress
                    percent={progress}
                    trailColor={progressColor}
                    strokeColor={progressBgColor}
                    showInfo={false}
                />
                <span>{current ?? 0} / {target}</span>
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