
async function fetchNews() {
  try {
    const response = await fetch('https://rss.dw.com/rdf/rss-en-all');
    const text = await response.text();

    // تبدیل RSS به XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    // دریافت تمام عناصر <item>
    const items = xmlDoc.getElementsByTagName('item');
    const newsContainer = document.getElementById('news-container');

    // ایجاد لیست اخبار
    let newsHtml = '';
    for (let i = 0; i < items.length; i++) {
      const title = items[i].getElementsByTagName('title')[0].textContent;
      const link = items[i].getElementsByTagName('link')[0].textContent;
      const description = items[i].getElementsByTagName('description')[0].textContent;
      const image = items[i].getElementsByTagName('media:content')[0]?.getAttribute('url') || '';

      newsHtml += `
        <div class="news-item">
          <h3><a href="${link}" target="_blank">${title}</a></h3>
          ${image ? `<img src="${image}" alt="${title}" />` : ''}
          <p>${description}</p>
        </div>
      `;
    }

    newsContainer.innerHTML = newsHtml;
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

fetchNews();

	
async function getLocation() {
  try {
    const response = await fetch('https://ipinfo.io/json?token=f5764955a47b14');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching location:', error);
  }
}



async function getWeather(lat, lon) {
  try {
    const apiKey = '55599e486acc0fd0b25b7edf57487a06'; // کلید API خود را وارد کنید
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
}

async function displayWeather() {
  try {
    // دریافت موقعیت جغرافیایی
    const location = await getLocation();
    const [lat, lon] = location.loc.split(','); // موقعیت را به عرض و طول جغرافیایی تقسیم می‌کند
    
    // دریافت اطلاعات آب و هوا
    const weather = await getWeather(lat, lon);
let weatherIcon = '';
    const weatherId = weather.weather[0].id;

    switch (weatherId) {
      // Thunderstorm
      case 200: case 201: case 202:
      case 210: case 211: case 212:
      case 221: case 230: case 231:
      case 232:
        weatherIcon = '<i class="fas fa-cloud-bolt"></i>';
        break;

      // Drizzle
      case 300: case 301: case 302:
      case 310: case 311: case 312:
      case 313: case 314: case 321:
        weatherIcon = '<i class="fas fa-cloud-rain"></i>';
        break;

      // Rain
      case 500: case 501: case 502:
      case 503: case 504: case 511:
      case 520: case 521: case 522:
      case 531:
        weatherIcon = '<i class="fas fa-cloud-showers-heavy"></i>';
        break;

      // Snow
      case 600: case 601: case 602:
      case 611: case 612: case 613:
      case 615: case 616: case 620:
      case 621: case 622:
        weatherIcon = '<i class="fas fa-snowflake"></i>';
        break;

      // Atmosphere (Mist, Smoke, Haze, etc.)
      case 701: case 711: case 721:
      case 731: case 741: case 751:
      case 761: case 762: case 771:
      case 781:
        weatherIcon = '<i class="fas fa-smog"></i>';
        break;

      // Clear
      case 800:
        weatherIcon = '<i class="fas fa-sun"></i>';
        break;

      // Clouds
      case 801: // Few clouds
        weatherIcon = '<i class="fas fa-cloud-sun"></i>';
        break;
      case 802: // Scattered clouds
        weatherIcon = '<svg fill="white" height="2rem" width="2rem" version="1.1"  id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 455 455" xml:space="preserve"><g><path d="M391.016,135.059c-5.829-49.336-47.791-87.605-98.695-87.605c-33.184,0-62.556,16.272-80.607,41.262   c2.108-0.081,4.223-0.127,6.349-0.127c74.519,0,138.462,50.218,157.487,120.164c21.304,4.704,40.866,15.374,56.667,31.173   c1.403,1.403,2.764,2.836,4.085,4.297C447.852,232.648,455,216.682,455,199.04C455,163.704,426.352,135.059,391.016,135.059z"/><path d="M350.359,236.02c-7.814-66.133-64.062-117.431-132.296-117.431c-68.234,0-124.482,51.298-132.296,117.431   C38.402,236.02,0,274.417,0,321.783s38.397,85.763,85.763,85.763h264.601c47.366,0,85.763-38.397,85.763-85.763   S397.725,236.02,350.359,236.02z"/></g></svg>';
        break;
      case 803: // Broken clouds
      case 804: // Overcast clouds
        weatherIcon = '<i class="fas fa-cloud"></i>';
        break;

      // Additional (Tornado, Tropical storm, Hurricane, etc.)
      case 900: // Tornado
      case 781: // Tornado
        weatherIcon = '<i class="fas fa-wind"></i>';
        break;
      case 901: // Tropical storm
      case 902: // Hurricane
        weatherIcon = '<i class="fas fa-wind"></i>';
        break;
      case 903: // Cold
        weatherIcon = '<i class="fas fa-temperature-low"></i>';
        break;
      case 904: // Hot
        weatherIcon = '<i class="fas fa-temperature-high"></i>';
        break;
      case 905: // Windy
        weatherIcon = '<i class="fas fa-wind"></i>';
        break;
      case 906: // Hail
        weatherIcon = '<i class="fas fa-cloud-meatball"></i>';
        break;

      default:
        weatherIcon = '<i class="fas fa-question"></i>'; // Default icon
        break;
    }
    // weather data
    document.getElementById('weather-container').innerHTML = 
	`
    
	<p>
		<i  style="font-size:2.5rem; " class="fa-solid fa-location-dot"></i>
		<i class="fa-solid " style=" font-size:1.5rem; padding: 0 1rem 0 0.2rem;"> ${weather.name }</i> 
		<i style="font-size:2.5rem;" class="fa-solid fa-temperature-half"></i>
		<i class="fa-solid " style="font-size:1.5rem;">
		${weather.main.temp}°C </i><i " style="font-size:2rem;padding-left:0.5rem;">${weatherIcon }</i>
	</p>
    
	` ;
  } catch (error) {
    console.error('Error displaying weather:', error);
  }


}

displayWeather();


function today() {
  try {
    const d = new Date();
    document.getElementById("mytoday").innerHTML = d.toDateString();
  } catch (error) {
    console.error('Error:', error);
  }
}

today();


  document.getElementById('playButton').addEventListener('click', function() {
            var audio = document.getElementById('welcomeAudio');
            audio.play().then(() => {
                // مخفی کردن دکمه بعد از پخش موفق صدا
                document.getElementById('playButton').style.display = 'none';
            }).catch((error) => {
                console.error('پخش صدا ممکن نیست: ', error);
            });
        });
		
audioElement.play();



fetch('pharmacies.csv')
  .then(response => response.text())
  .then(csvText => {
    // استفاده از PapaParse برای تبدیل CSV به داده‌های JSON
    const data = Papa.parse(csvText, { header: true }).data;
    
    // پیدا کردن بدنه جدول
    const tableBody = document.querySelector('#pharmacyTable tbody');

    // اضافه کردن داده‌ها به جدول
    data.forEach(row => {
      const tableRow = `
        <tr>
          <td>${row['s/n']}</td>
          <td>${row['name']}</td>
          <td>${row['city']}</td>
          <td>${row['address']}</td>
          <td>${row['phone']}</td>
          <td>${row['owner']}</td>
        </tr>
      `;
      tableBody.innerHTML += tableRow;
    });

    // فعال کردن DataTables
    $('#pharmacyTable').DataTable();
  });
