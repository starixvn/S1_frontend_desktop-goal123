import React, {
	useEffect,
	useState,
	useRef,
	createRef,
	useContext
} from "react";
import { useTranslation } from "react-i18next";
import { popBoxContext, userInfoContext } from "../common/context";
import config from "../../config";
import { api_accountStrict_UploadCustPhotoId } from "../../service/api/accountStrict";
import Loading from "../common/loading";
import { defPopBoxType } from "../common/popBox";

export default props => {
	const { t } = useTranslation();
	const isMountedRef = useRef(null);
	const filebox = createRef();
	const [loading, setLoading] = useState(false);
	const { setPopBox } = useContext(popBoxContext);
	const { userInfo } = useContext(userInfoContext);

	const dragOver = e => {
		e.preventDefault();
	};

	useEffect(() => {
		isMountedRef.current = true;
		return () => (isMountedRef.current = false);
	});

	const [fileImg, setFileImg] = useState("");
	const [fileData, setFileData] = useState([]);
	const [picFileName, setPicFileName] = useState("");

	const onChangeFile = (action, e) => {
		e.preventDefault();
		let files =
			action === "onDrop" ? e.dataTransfer.files : filebox.current.files;
		if (files.length > 0) {
			setPicFileName(files[0].name);
			setFileData(files);
			let reader = new FileReader();
			reader.readAsDataURL(files[0]);
			reader.onload = () => {
				setFileImg(reader.result);
			};
		}
	};

	const onUploadFile = () => {
		const ClickClose = () => {
			setPopBox({ isOpen: false });
		};

		if (fileData.length > 0) {
			let formData = new FormData();
			formData.append("PhotoId", fileData[0]);
			api_accountStrict_UploadCustPhotoId(formData).then(
				res => {
					if (isMountedRef.current) {
						if (res.data.errorCode === 0) {
							props.getKycStatus();
						} else {
							setPopBox({
								isOpen: true,
								popBoxType: defPopBoxType.ErrorMsg,
								message: res.data.message,
								btnBar: (
									<div className="btnGroup">
										<button
											className="btn-cancel"
											onClick={ClickClose}>
											{t("lbl_Close")}
										</button>
									</div>
								)
							});
						}
						setLoading(false);
					}
				},
				err => {
					if (isMountedRef.current) {
						setPopBox({
							isOpen: true,
							popBoxType: defPopBoxType.ErrorMsg,
							message: t("msg_ApiServerError"),
							btnBar: (
								<div className="btnGroup">
									<button
										className="btn-cancel"
										onClick={ClickClose}>
										{t("lbl_Close")}
									</button>
								</div>
							)
						});
						setLoading(false);
					}
				}
			);
		}
	};

	return loading ? (
		<Loading />
	) : (
		<div className="subModuleList">
			<div className="subModule">
				<div className="subModuleBody column align-items-center">
					<span className="title txt-yellow">
						{t("lbl_SubmitPhotoId")}
					</span>
					<div className="txt-lightgray">
						{t("lbl_SubmitPhotoIdList_Title")}
						<br />
						{t("lbl_ImageUploadWarning")}
						<br />
						{t("lbl_ImageJpgPngOnly")}
					</div>

					<label
						className="upload_img"
						onDragOver={dragOver.bind(this)}
						onDrop={onChangeFile.bind(this, "onDrop")}>
						<input
							type="file"
							accept="image/*"
							ref={filebox}
							onChange={onChangeFile.bind(this, "onChange")}
						/>
						{picFileName ? (
							<img alt="for kyc" src={fileImg} />
						) : (
							<i className="icon icon-plus"></i>
						)}
					</label>
					<div className="directions">
						<ul>
							<li>{t("lbl_NationalIdentityCard")}</li>
							<li>{t("lbl_Passport")}</li>
							<li>{t("lbl_DrivingLicense")}</li>
						</ul>
					</div>
					<div className="btnGroup">
						<button
							className="btn-check"
							onClick={onUploadFile.bind(this, "submit")}>
							{t("lbl_Submit")}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
