import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router';
import './App.scss';
import './keyframes.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Home } from './Pages';

function App() {
	return (
		<div className="App">
			{/* <header>
				<div>
					<img src="/Media/Icons/logo.png" alt="logo" />
					<button>
						Login button
					</button>
				</div>
			</header> */}
			{/** Please update routes constant if there's a new page */}
			<Routes>
				<Route path="/" element={<Home />}></Route>
			</Routes>

			{/* <footer>
				sitemap
			</footer> */}

			<ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme={'colored'}
            />
		</div>
	);
}

export default App;