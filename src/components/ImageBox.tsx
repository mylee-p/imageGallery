function ImageBox(props: {
	src: string;
}) {
	return <div className="image-box">
		<img src={props.src} />
	</div>
}

export default ImageBox;