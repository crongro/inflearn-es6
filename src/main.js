class Blog {
	constructor() {
		this.setInitVariables();
		this.registerEvents();
		this.likedSet = new Set();
	}

	setInitVariables() {
		this.blogList = document.querySelector(".blogList > ul");
	}

	registerEvents() {
		const startBtn = document.querySelector(".start");
		//const dataURL = "https://tlhm20eugk.execute-api.ap-northeast-2.amazonaws.com/prod/lambda_get_blog_info";
		const dataURL = "/data/data.json";

		startBtn.addEventListener("click", () => {
			this.setInitData(dataURL);
		});

		this.blogList.addEventListener("click", ({target}) => {
			const targetClassName = target.className; 
			if(targetClassName !== "like" && targetClassName !=="unlike") return;

			const postTitle = target.previousElementSibling.textContent;

			if(targetClassName === "unlike") {
				target.className = "like";
				target.innerText = "찜하기";
				this.likedSet.delete(postTitle);
			} else {
				target.className = "unlike";
				target.innerText = "찜취소";
				this.likedSet.add(postTitle);
			}

			//내 찜 목록 뷰에 추가.
			this.updateLikedList();
			//dispatcher.emit("CHANGE_LIKE_LIST", {'title' : this.likedSet})

		});

	}

	updateLikedList() {
		const ul = document.querySelector(".like-list > ul");
		let likedSum = "";

		//li태그에 찜리스트를 넣고 한번의 innerHTML을 사용한다.
		this.likedSet.forEach ( (v) => {
			likedSum += `<li> ${v} </li>`;
		})

		ul.innerHTML = likedSum;
	}

	setInitData(dataURL) {
		this.getData(dataURL, this.insertPosts.bind(this));
	}

	getData(dataURL, fn) {
		const oReq = new XMLHttpRequest();
		oReq.addEventListener("load", () => {
			//const list = JSON.parse(JSON.parse(oReq.responseText).body);
			const list = JSON.parse(oReq.responseText).body;
			fn(list);
		});
		oReq.open('GET', dataURL);
		oReq.send();
	}

	insertPosts(list) {
		list.forEach((v) => {
			this.blogList.innerHTML += `
				 <li>
				 	<a href=${v.link}> ${v.title} </a>
				 	<div class="like">찜하기</div>
				 </li>
				 `;
		})
	}
}

export default Blog;