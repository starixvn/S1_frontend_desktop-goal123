import React, { createRef, Component } from "react";
import moment from "moment";
import DateTime from "react-datetime";
import config from "../../config";
import Loading from "../common/loading";
import { defPopBoxType } from "../common/popBox";
import Inputbox from "../common/inputbox";
import {
	api_payment_UploadReceipt,
	api_payment_SetDepositReceipt
} from "../../service/api/payment";
import ClipboardJS from "../../lib/clipboard.min";
import { number_format } from "../common/common";

export class Module extends Component {
	state = {
		processing: false,
		loading: false,
		depositTime: this.props.depositTime ? this.props.depositTime : moment(),
		refId: this.props.refId ? this.props.refId : "",
		picFileName: this.props.picFileName ? this.props.picFileName : null,
		fileImg: null,
		refIdTip: { checked: null, tip: "" }
	};
	isMountedRef = false;
	filebox = createRef();

	componentDidMount() {
		this.isMountedRef = true;

		/* eslint-disable */
		this._clipboard = new ClipboardJS(".copyBtn");
		this._clipboard.on("success", e => {});
		this._clipboard.on("error", e => {});
		/* eslint-enable */
	}

	componentWillUnmount() {
		this.isMountedRef = false;
		this._clipboard.destroy();
	}

	onUploadFile = (action, e) => {
		e.preventDefault();
		let files =
			action === "onDrop"
				? e.dataTransfer.files
				: this.filebox.current.files;

		this.setState({ picFileName: files[0].name });

		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onload = () => {
			this.setState({ fileImg: reader.result });
		};

		if (files.length > 0) {
			this.setState({ loading: true });

			let formData = new FormData();
			formData.append("TransId", this.props.transId);
			formData.append("Receipt", files[0]);
			api_payment_UploadReceipt(formData).then(
				res => {
					if (this.isMountedRef) {
						this.setState({ loading: false });
						if (res.data.errorCode === 0) {
						} else {
							alert(res.data.message);
						}
					}
				},
				err => {
					if (this.isMountedRef) {
						alert(this.datas.i18n("msg_ApiServerError"));
						this.setState({ loading: false });
					}
				}
			);
		}
	};

	dragOver = e => {
		e.preventDefault();
	};
	editField = (col, value, e) => {
		value =
			value === null
				? e.target.value.replace(/^(0+)|[^\d]+/g, "")
				: value;
		this.setState({ [col]: value === null ? e.target.value : value });
	};

	checkTip = e => {
		let val = e.target.value;
		let _tip = "";
		let _checked = true;

		if (!val) {
			_tip = this.props.i18n("lbl_RemindForRefNum");
			_checked = false;
		}

		this.setState({ refIdTip: { checked: _checked, tip: _tip } });
	};

	clickInfo = () => {
		let _msg =
			this.state.refIdTip.tip !== ""
				? ""
				: this.props.i18n("lbl_RefNoHint");
		this.setState({ refIdTip: { checked: null, tip: _msg } });
	};

	clickSubmit = e => {
		e.preventDefault();
		if (!this.state.processing) {
			this.setState({ processing: true });

			if (this.state.refId !== "") {
				this.setState({ loading: true });

				api_payment_SetDepositReceipt(
					this.props.transId,
					moment(this.state.depositTime).unix(),
					this.state.refId
				).then(
					res => {
						if (this.isMountedRef) {
							this.setState({ processing: false });
							this.setState({ loading: false });
							if (res.data.errorCode === 0) {
								const ClickClose = () => {
									if (this.props.refreshDatas) {
										this.props.refreshDatas();
									} else if (this.props.backDeposit) {
										this.props.backDeposit();
									}

									this.props.ClosePopBox();
								};

								this.props.setPopBox(prevS => ({
									isOpen: true,
									popBoxType: defPopBoxType.Success,
									prevBtnBar: prevS.btnBar,
									btnBar: (
										<div className="btnGroup">
											<button
												className="btn-cancel"
												onClick={ClickClose}>
												{this.props.i18n("lbl_Close")}
											</button>
										</div>
									)
								}));
							} else {
								alert(res.data.message);
							}
						}
					},
					err => {
						if (this.isMountedRef) {
							alert(this.props.i18n("msg_ApiServerError"));
							this.setState({ processing: false });
							this.setState({ loading: false });
						}
					}
				);
			} else {
				if (this.isMountedRef) {
					this.setState({
						refIdTip: {
							checked: false,
							tip: this.props.i18n("lbl_RemindForRefNum")
						}
					});
					this.setState({ processing: false });
				}
			}
		}
	};
	render() {
		return this.loading ? (
			<Loading />
		) : (
			<>
				<span className="title">
					{this.props.i18n("lbl_SubmitProof")}
				</span>
				<div className="txt-lightgray">
					{this.props.i18n("lbl_AttachFile")}
				</div>
				<label
					className="upload_img"
					onDragOver={this.dragOver.bind(this)}
					onDrop={this.onUploadFile.bind(this, "onDrop")}>
					<input
						type="file"
						accept="image/*"
						ref={this.filebox}
						onChange={this.onUploadFile.bind(this, "onChange")}
					/>
					{this.state.picFileName ? (
						<img
							alt="bank slip"
							src={
								this.state.fileImg === null
									? `${config.apiURL}/${this.props.langId}/Cashier/DepositReceip.jpg?transId=${this.props.transId}&FileName=${this.state.picFileName}`
									: `${this.state.fileImg}`
							}
						/>
					) : (
						<i className="icon icon-plus"></i>
					)}
				</label>
				{this.state.picFileName !== null ? (
					<span>{this.state.picFileName}</span>
				) : null}
				<div className="directions">
					<ul>
						<li>{this.props.i18n("BankSlipHint1")}</li>
						<li>{this.props.i18n("BankSlipHint2")}</li>
						<li>{this.props.i18n("BankSlipHint3")}</li>
					</ul>
				</div>

				<div className="smallList checkBankSlip">
					<div className="txt-lightgray">
						{this.props.i18n("lbl_TransactionHint")}
					</div>
					<ul>
						<li>
							<div className="bankName">
								<img
									src={`${config.imgUrl}/common/images/BankLogo/${this.props.bankLogo}`}
									alt={this.props.bankName}
								/>
							</div>
						</li>
						<li>{this.props.bankName}</li>
						<li>
							<a
								href={this.props.bankSite}
								className="icon icon-new-tab"
								target="_blank"></a>
						</li>
					</ul>
					<ul>
						<li>{this.props.i18n("lbl_BankAccountName")}</li>
						<li>{this.props.accountName}</li>
						<li>
							<button
								className="icon icon-files-empty copyBtn"
								data-clipboard-text={
									this.props.accountName
								}></button>
						</li>
					</ul>
					<ul>
						<li>{this.props.i18n("lbl_BankNumber")}</li>
						<li>{this.props.accountNo}</li>
						<li>
							<button
								className="icon icon-files-empty copyBtn"
								data-clipboard-text={
									this.props.accountNo
								}></button>
						</li>
					</ul>
					<ul>
						<li>{this.props.i18n("lbl_DepositAmount")}</li>
						<li>
							{number_format(
								this.props.amount,
								this.props._isConvert
							)}
						</li>
						<li>
							<button
								className="icon icon-files-empty copyBtn"
								data-clipboard-text={
									this.props.amount
								}></button>
						</li>
					</ul>
				</div>

				<form onSubmit={this.clickSubmit}>
					<div className="inputBox">
						<i className="txt-blue12">
							{this.props.i18n("lbl_DepositTime")}
						</i>
						<DateTime
							value={moment(this.state.depositTime).format(
								"YYYY-MM-DD HH:mm A"
							)}
							onChange={this.editField.bind(this, "depositTime")}
						/>
						<div className="iconModule">
							<i className="icon icon-calendar"></i>
						</div>
					</div>
					<Inputbox
						title={this.props.i18n("lbl_Refno")}
						value={this.state.refId}
						onChange={this.editField.bind(this, "refId", null)}
						onBlur={this.checkTip.bind(this)}
						clickInfo={this.clickInfo}
						checked={this.state.refIdTip.checked}
						tip={this.state.refIdTip.tip}
					/>
					<div className="btnGroup">
						<button
							type="button"
							className="btn-cancel"
							onClick={this.props.ClosePopBox}>
							{this.props.i18n("lbl_Cancel")}
						</button>
						<button className="btn-check" type="submit">
							{this.props.i18n("lbl_Submit")}
						</button>
					</div>
				</form>
			</>
		);
	}
}
