let active = false;

function getImages(): void {
  const elements2 = document.getElementsByTagName("img");
  console.log(elements2);
  let elementhtml = "";
  for (let i = 0; i < elements2.length; i++) {
    elements2[i].id = "img" + i;
    elementhtml += `<img src=${elements2[i].src} id="${elements2[i].id}"></img>`;
  }
  chrome.runtime.sendMessage({
    type: "getImages",
    ammt: elements2.length,
    elements: elementhtml,
  });
}

chrome.tabs.query({ active: true }, (tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab[0].id ? tab[0].id : -1 },
      func: getImages,
    },
    () => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
    }
  );
});
function goToImage(id: string): void {
  if (window.location.href.includes("#img")) {
    window.location.href =
      window.location.href.slice(0, window.location.href.indexOf("#img")) +
      "#" +
      id;
  } else {
    window.location.href += "#" + id;
  }
}
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type === "getImages") {
    const elements = request.elements;
    const ammt = request.ammt;
    console.log(elements);
    document.getElementById("ammt")!.textContent = `${ammt} images found`;
    document.getElementById("images")!.innerHTML = elements;
    document.getElementById("images")!.addEventListener("click", (e) => {
      chrome.tabs.query({ active: true }, (tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab[0].id ? tab[0].id : -1 },
          func: goToImage,
          // @ts-ignore
          args: [e.target!.id],
        });
      });
    });
  }
});
