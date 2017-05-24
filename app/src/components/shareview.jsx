import React from 'react';
import $ from 'jquery';
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

import './shareview.css';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const PinterestIcon = generateShareIcon('pinterest');
const VKIcon = generateShareIcon('vk');
const OKIcon = generateShareIcon('ok');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');

class ShareView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 0
		}
	}

	componentDidMount() {
		$(this.refs.input).focus();
		$(this.refs.input).select();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.selectedTab !== this.state.selectedTab) {
			$(this.refs.input).focus();
			$(this.refs.input).select();		
		}
	}

	onTab(tab) {
		this.setState({
			selectedTab: tab
		});
	}

	render() {
		const width = 400;
		const height = 44;
		const title = 'fourplayer';
		const description = null;
		const picture = null;
		const url = this.props.embedUrl;

		const shareButtons = this.state.selectedTab === 0 ? (
			<div style={{
				marginBottom: 12
			}}>
				<div className='ShareView-button'>						
						<FacebookShareButton url={url} title={title} description={description} picture={picture}>
							<FacebookIcon size={32} round />
						</FacebookShareButton>
					</div>

					<div className='ShareView-button'>			
						<TwitterShareButton url={url} title={title} via={description} hashtags={picture}>
							<TwitterIcon size={32} round />
						</TwitterShareButton>
					</div>

					<div className='ShareView-button'>			
						<GooglePlusShareButton url={url}>
							<GooglePlusIcon size={32} round />
						</GooglePlusShareButton>
					</div>

					<div className='ShareView-button'>			
						<LinkedinShareButton url={url} title={title} description={description}>
							<LinkedinIcon size={32} round />
						</LinkedinShareButton>
					</div>

					<div className='ShareView-button'>			
						<TelegramShareButton url={url} title={title}>
							<TelegramIcon size={32} round />
						</TelegramShareButton>
					</div>

					<div className='ShareView-button'>			
						<WhatsappShareButton url={url} title={title}>
							<WhatsappIcon size={32} round />
						</WhatsappShareButton>
					</div>

					<div className='ShareView-button'>			
						<PinterestShareButton url={url} description={description} media={picture}>
							<PinterestIcon size={32} round />
						</PinterestShareButton>
					</div>

					<div className='ShareView-button'>			
						<VKShareButton url={url} title={title} description={description} image={picture}>
							<VKIcon size={32} round />
						</VKShareButton>
					</div>

					<div className='ShareView-button'>			
						<OKShareButton url={url} title={title} description={description} image={picture}>
							<OKIcon size={32} round />
						</OKShareButton>
					</div>
			</div>) : null;

		return (
			<div style={{
				width: width,
				border: '1px solid #CCC',
				backgroundColor: '#FFF',
				paddingLeft: 12,
				paddingRight: 12,
				paddingTop: 12
			}}>
				<div style={{
					marginBottom: 15
				}}>
					<span style={{
						paddingRight: 12,
						borderRight: '1px solid #CCC',
						color: this.state.selectedTab === 0 ? '#000000' : '#999999'
					}} className='ShareView-tab'
					onClick={this.onTab.bind(this, 0)}>Share</span>
					<span style={{
						paddingLeft: 12,
						paddingRight: 12,
						color: this.state.selectedTab === 1 ? '#000000' : '#999999'
					}} className='ShareView-tab'
					onClick={this.onTab.bind(this, 1)}>Embed</span>
				</div>

				<div style={{
					marginBottom: 12
				}}>
					{shareButtons}
					<input 
					style={{
						height: 24,
						width: '100%',
						outline: 'none',
						boxSizing: 'border-box'
					}} 
					defaultValue={this.state.selectedTab === 0 ? this.props.embedUrl : this.props.embedCode}
					ref='input' 
					type='text'
					spellCheck={false}>
					</input>
				</div>
			</div>
		);
	}
};

export default ShareView;