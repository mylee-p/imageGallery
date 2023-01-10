# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

----

## Image Gallery

<br/>

<img width="960" alt="imageGallery" src="https://user-images.githubusercontent.com/89143892/211480785-b971e430-785a-4ad6-af9f-4909091a32d1.png">

-파일을 선택하면 이미지를 추가할 수 있게 개발<br />-이미지 삭제 기능 추가<br />-반응형으로 개발하여 화면이 작아지면 좌우로 스크롤하여 이미지를 볼 수 있는 기능 추가

<br/>

### React 프로젝트 생성

그냥 리액트를 사용하게 되면 따로 리액트, 리액트 돔, 번들러, 바벨 등등을 일일이 설치해야되기 때문에<br /> create react-app 설치 권장

```
$ npm i -g yarn
$ yarn create react-app image-gallery[폴더명] --template typescript
```

<br/>

### 이미지 갤러리 로직 구현하기

-버튼을 클릭하면 이미지 파일을 드래그해서 내려받을 수 있고 삭제할 수 있는 가능 구현<br/>-이미지 박스들은 무한히 늘어날 수 있다. [이미지를 계속 추가할 수 있기 때문]<br/>

\*이미지가 들어갈 컴포넌트 만들기

```tsx
// src/components/ImageBox.tsx

//타입스크립트 문법으로 props의 타입을 정해준다.[props는 기본적으로 오브젝트여야함 {}]
function ImageBox(props: { src: string }) {
    return (
        <div className="image-box">
            {/* 이미지를 받을 수 있게 기능 구현 */}
            <img src={props.src} />
        </div>
    );
}

//해당 함수를 다른 곳에서 사용할 것이니까 export를 통해 내보내준다.
export default ImageBox;
```

\*이미지 렌더링

```tsx
// App.tsx

import React, { useRef, useState } from "react";
import "./App.css";
import ImageBox from "./components/ImageBox";

function App() {
  const inpRef = useRef<HTMLInputElement>(null);
  const [imageList, setImageList] = useState<string[]>([]);

  console.log(imageList);

  return (
    <div className="container">
      <div className={"gallery-box" + (imageList.length > 0 && "row")}>
        {imageList.length === 0 && (
          <div className="text-center">
            이미지가 없습니다. <br />
            이미지를 추가해주세요.
          </div>
        )}
        <input
          type="file"
          ref={inpRef}
          onChange={(event) => {
            if (event.currentTarget.files?.[0]) {
              const file = event.currentTarget.files[0];

              console.log(file.name);

              //파일을 이미지 url로 바꿔주기
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = (event) => {
                setImageList((prev) => [
                  ...prev,
                  event.target?.result as string,
                ]);
              };
            }
          }}
        />
        {imageList.map((el, idx) => (
          <ImageBox key={el + idx} src={el} />
        ))}
        <div
          className="puls-box mt"
          onClick={() => {
            inpRef.current?.click();
          }}
        >
          +
        </div>
      </div>
    </div>
  );
}

export default App;
```

<br/>

### 드래그 드롭 사용하여 UX 개선하기

react-dropzone 라이브러리를 사용하여 드래그 드롭 기능 구현
```
$ yarn add react-dropzone
$ yarn add @types/react-dropzone
```

<br/>

파일을 클릭해서 넣는 것이 아닌 폴더에서 드래그 앤 드롭으로 이미지 추가 가능하게 구현
```tsx
// App.tsx

import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css';
import ImageBox from './components/ImageBox';


function App() {
	const [imageList, setImageList] = useState<string[]>([])

	const onDrop = useCallback(acceptedFiles => {
		console.log(acceptedFiles)
		if (acceptedFiles.length) {


			for (const file of acceptedFiles) {
				const reader = new FileReader();

				reader.readAsDataURL(file)
				reader.onloadend = (event) => {
					setImageList(prev => [...prev, event.target?.result as string])
				}
			}
		}
	}, [])

	const { getRootProps, getInputProps } = useDropzone({ onDrop })


	return (
		<div className='container'>
			<div className={'gallery-box ' + (imageList.length > 0 && 'row')}>
				{
					imageList.length === 0 &&
					<div className='text-center'>
						이미지가 없습니다.<br />
						이미지를 추가해주세요.
					</div>
				}
				{
					imageList.map((el, idx) => <ImageBox key={el + idx} src={el} />)
				}
				<div className='plus-box'
					{...getRootProps()}
				>
					<input
						{...getInputProps()}
					/>
					+
				</div>
			</div>
		</div>
	);
}

export default App;
```
