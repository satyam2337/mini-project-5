// hiding pages.
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';

  // Show .bottomText only on "home" section
  const bottomText = document.querySelector('.bottomText');
  if (sectionId === 'textToImage') {
    bottomText.style.display = 'block';
  } else {
    bottomText.style.display = 'none';
  }
}

//scrpit for index page 1
async function generateImage() {
  const prompt = document.getElementById('prompt').value;

  // Create a card with a loading animation and text
  const results = document.getElementById('results');
  const card = document.createElement('div');
  card.className = 'card';

  const loader = document.createElement('div');
  loader.className = 'loader';

  const cardText = document.createElement('div');
  cardText.className = 'card-text';
  cardText.textContent = 'Generating image...';

  card.appendChild(loader);
  card.appendChild(cardText);
  results.appendChild(card);

  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    {
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (response.ok) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    displayImage(url, prompt, card);
  } else {
    console.error('Image generation failed', response.statusText);
  }
}


function displayImage(url, prompt, card) {
  const loader = card.querySelector('.loader');
  card.removeChild(loader);

  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Generated Image';
  img.style.width = '400px';
  img.style.height = '400px';

  const cardText = card.querySelector('.card-text');
  cardText.textContent = prompt;

  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'download-btn';
  downloadBtn.textContent = 'Download';
  downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  card.insertBefore(img, cardText);
  card.appendChild(downloadBtn);
}

function clearResults() {
  document.getElementById('results').innerHTML = '';
  document.getElementById('prompt').value = '';
}

function generateRandomText() {
  const randomTexts = [
    'A serene sunset over the mountains',
    'A futuristic cityscape at night',
    'A dragon flying over a medieval castle',
    'A whimsical forest with magical creatures',
    'A spaceship exploring a distant planet'
  ];
  const randomIndex = Math.floor(Math.random() * randomTexts.length);
  document.getElementById('prompt').value = randomTexts[randomIndex];
}


//page 2 script
function previewImage(event) {
  const imagePreview = document.getElementById("imagePreview");
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.innerHTML =
        `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; border-radius: 8px;">`;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.innerHTML = "";
  }
}

function clearImage() {
  document.getElementById("imageUpload").value = "";
  document.getElementById("imagePreview").innerHTML = "";
  document.getElementById("results2").innerHTML = "";
}

async function UploadImg() {
  const fileInput = document.getElementById("imageUpload");
  const resultsDiv = document.getElementById("results2");
  resultsDiv.innerHTML = "";

  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select an image before clicking upload!");
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("image", file);
  formData.append("output_type", "cutout");
  formData.append("bg_blur", "0");
  formData.append("scale", "fit");
  formData.append("auto_center", "false");
  formData.append("stroke_size", "0");
  formData.append("stroke_color", "FFFFFF");
  formData.append("stroke_opacity", "100");
  formData.append("shadow", "disabled");
  formData.append("shadow_opacity", "20");
  formData.append("shadow_blur", "50");
  formData.append("format", "PNG");

  try {
    resultsDiv.innerHTML = "<p>Uploading and processing your image...</p>";

    const response = await fetch("https://api.picsart.io/tools/1.0/removebg", {
      method: "POST",
      headers: {
        accept: "application/json",
        "X-Picsart-API-Key": "eyJraWQiOiI5NzIxYmUzNi1iMjcwLTQ5ZDUtOTc1Ni05ZDU5N2M4NmIwNTEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoLXNlcnZpY2UtMjNkMjMzYjktZDA4Ny00ZTdiLTg4YTctZjlhNmViNjBjNTBhIiwiYXVkIjoiNDc4NzY3MzQ2MDE0MTAxIiwibmJmIjoxNzQxMDcxNDE3LCJzY29wZSI6WyJiMmItYXBpLmdlbl9haSIsImIyYi1hcGkuaW1hZ2VfYXBpIl0sImlzcyI6Imh0dHBzOi8vYXBpLnBpY3NhcnQuY29tL3Rva2VuLXNlcnZpY2UiLCJvd25lcklkIjoiNDc4NzY3MzQ2MDE0MTAxIiwiaWF0IjoxNzQxMDcxNDE3LCJqdGkiOiIwODgwZDE2NS01MTE3LTRmMGUtYjMwNy01NDQzNmZiNTYxMzEifQ.kDkeGtAV3xf8ypQNceTxAVEvheIVlHL-EIyIBL4GHtZt1KTC8D8cQPen-XHgVH96tAbmYoXZ919_s3ggaYo4BrPqP2trehDH6kMale07r338ntr4T_dKTMFC4SRijWDBLessHoQDZlrhtGNDVWV0fdFI2_-UKzG1Xf_A-8bDXJy14Jo6ty3T5QYQEhX_ZhIpcB2PlpOF38Dysbz4ZMJtE2c7FQd7L5ZtV_piErBG1fnh2bmSqjsS16tBNzfpWMLVTQ42H0gAWEendSQWSydx3pLmF7utlA_jqOS3zXaEjiagYD_HIOHZkk1WFtGuEsBR9p20tDfvPx6ehxHVBzrChg"
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    if (result.data && result.data.url) {
      resultsDiv.innerHTML = `
              <img src="${result.data.url}" alt="Processed Image" style="max-width: 100%; border-radius: 8px;">
              <div style="margin-top: 1rem;">
                  <a href="${result.data.url}" download="processed_image.png" style="padding: 0.5rem 1rem; border: none; background-color: #4CAF50; color: white; border-radius: 5px; cursor: pointer; text-decoration: none;">Download</a>
              </div>
          `;
    } else {
      throw new Error("Invalid response from API");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    resultsDiv.innerHTML = `<p style="color: red;">Failed to process the image. Please try again later.</p>`;
  }
}


