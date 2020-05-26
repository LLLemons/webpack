import React from 'react';
import ReactDom from 'react-dom';
import './search.less';
import ImgLogo from './images/logo-black.png';

const Search = () => {
	return (
		<div className='search-text'>
			<img src={ImgLogo} />
			中文字体
		</div>
	);
};

ReactDom.render(<Search />, document.getElementById('root'));
