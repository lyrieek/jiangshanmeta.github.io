{
    function initWeather(){
        var searchBtn = document.getElementById("search");
        searchBtn.addEventListener("click",getWeatherInfo,false);
    }
    function getWeatherInfo(event){
        var input = document.getElementById("input");
        var city = input.value;
        if(!city){
            alert("请输入城市");
            return;
        }
        var baseYahooURL = "https://query.yahooapis.com/v1/public/yql?q="
        var selectedCity = "上海";
        var woeidYQL = 'select item.condition.text from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+ city + '")&format=json';
        var jsonURL = baseYahooURL + woeidYQL;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if((xhr.status>=200 && xhr.status<300) || xhr.status == 304 ){
                    var result = JSON.parse(xhr.responseText);
                    var resultText = result.query.results.channel.item.condition.text;
                    showWeather(resultText);
                }
            }
        }
        xhr.open("get",jsonURL,true);
        xhr.send(null);
    }
    function showWeather(text){
        var textEle = document.getElementById("text");
        textEle.innerText = text;
    }
    initWeather();
}




