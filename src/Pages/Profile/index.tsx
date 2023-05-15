import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './styles.scss';
import { ellipsizeThis } from '../../common/utils';
import { AddressContext, SquidContext } from '../../App';

const Page = () => {
    const [pfpFile, setPfpFile] = useState<File>();
    const [pfp, setPfp] = useState<string>("");
    const [selectedChain, setSelectedChain] = useState("");
    const [selectedToken, setSelectedToken] = useState("");
    const { address } = useContext(AddressContext);
    const { supportedChains, supportedTokens } = useContext(SquidContext);

    let inputRef = useRef<any>(null);

    const onSetPfpClick = useCallback(() => {
        if(!inputRef || !inputRef.current) {
            return;
        }

        inputRef.current.click();
    }, []);

    useEffect(() => {
        // if has selected chain already
        if(selectedChain) {
            return;
        }

        if(!supportedChains || supportedChains.length === 0) {
            return;
        }

        if(!supportedTokens || supportedTokens[supportedChains[0].name].length === 0) {
            return;
        }

        setSelectedChain(supportedChains[0].name);
        setSelectedToken(supportedTokens[supportedChains[0].name][0].name ?? "");

    }, [supportedChains, supportedTokens, selectedChain]);

    const onPfpValueChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setPfp(URL.createObjectURL(event.target.files[0]));
            setPfpFile(event.target.files[0]);
        }
    }, []);

    const onDestinationChainChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChain(e.target.value);
    }, []);

    return (
        <div className='profile-page'>
            <input ref={inputRef} type="file" className='d-none' name="profile" onChange={onPfpValueChanged}></input>
            <div className="pfp-container">
                <button onClick={onSetPfpClick}>
                    {

                        pfp?
                        <img src={pfp} alt="pfp" /> :
                        <i className='fa fa-user'></i>
                    }
                </button>

                <input type="text" className="form-control mt-3" placeholder='Display Name' />
            </div>
            <div className="row mt-5 justify-content-between">
                <div className="col-sm-12 col-md-5">
                    <strong>Social Media</strong>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Facebook</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Username"/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Twitter</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Username"/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Twitch</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Username"/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Instagram</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Username"/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">TikTok</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Username"/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Youtube</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Username"/>
                    </div>
                </div>
                <div className="col-sm-12 col-md-5">
                    <strong>Donation Settings</strong>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">streamera.com/</div>
                        </div>
                        <input type="text" className="form-control" placeholder="Username"/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Wallet</div>
                        </div>
                        <input type="text" className="form-control" value={ellipsizeThis(address, 6, 6)} disabled/>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Chain</div>
                        </div>
                        <select name="" className='form-control' onChange={onDestinationChainChange}>
                            {
                                supportedChains.map(x => <option key={x.chainId} value={x.name}>{x.name}</option>)
                            }
                        </select>
                    </div>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Token</div>
                        </div>
                        <select name="" className='form-control'>
                            {
                                selectedChain &&
                                supportedTokens[selectedChain].map(
                                    (x, index) => (
                                        <option 
                                            key={selectedChain + x.name + index}
                                            value={x.name} 
                                            style={{ backgroundImage: x.logoURI }}
                                        >
                                            {x.name}
                                        </option>
                                    )
                                )
                            }
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;