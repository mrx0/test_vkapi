	
	//Функция очищает поля приводим их к чистому виду
	function clearAllDivs (){
		$('#res').html('');
		$('#errors').html('');
		
		$('#res').append('<div style="display: block;">Всего примерно: <span id="items_count">0</span></div>');
		$('#res').append('<div>Удалено: <span id="deleted_items_count">0</span> <span id="loading_indicator"></span></div>');
		$('#res').append('<div id="last_action"></div>');
		//$('#res').append('<div>Примерно осталось времени: <span id="i_need_time"></span></div>');
	}
	
	//Функция для оверлея показать/скрыть
	function overlayBlock (show, data){
		if (show){
            $('#overlay').show();

            //$('#overlay_data').append( "<div id='central_block_in_overlay' style='width: 120px; height: 32px; padding: 10px; text-align: center; vertical-align: middle; border: 1px dotted rgb(255, 179, 0); background-color: rgba(255, 236, 24, 0.7);'><img src='img/wait.gif' style='float:left;'><span style='float: right;  font-size: 90%;'> обработка...</span></div>" );
            
			$('#overlay_data').append('<div id="central_block_in_overlay">'+data+'</div>' );

		}else {
            $('#overlay_data').html('');
            $('#overlay').hide();
        }
	}
	
	//Остановка выполнения через глобальную переменную
	function stopOrStartItNow (){
		if (STOP_IT_NOW) {
			STOP_IT_NOW = false;
			$('#stop_start').val('Остановить');
			//$('#last_action').html('Запущено');
			
			$('#errors').html('');
			
			//Запрос данных
			getVKData (token);
			
		}else{ 
			STOP_IT_NOW = true;
			$('#stop_start').val('Запустить');
			//$('#last_action').html('Остановлено');
		}
		
	}
	
	//Действия при кликах нажатиях
	$('#stop_start').on('click', function(){
		//console.log(STOP_IT_NOW);
		
		var overlayData = '';
		if (STOP_IT_NOW) {
			overlayData = 'Запускаем...';
		}else{
			overlayData = 'Останавливаем...';
		}
		//Включаем оверлей
		overlayBlock (true, overlayData);
		
		//Запус остановка выполнения
		stopOrStartItNow();		
	});
	
   //Закрыть оверлей и все остановливаем при этом
    $('.overlay_close').click( function(){ // ловим клик по крестику или оверлэю
		STOP_IT_NOW = true;
		$('#overlay_data').html('');
		$('#overlay').fadeOut(400); // прячем подложку
    });
	
	//Показываем небольшой типа прогресс бар :)
	function loadingIndicator(start, load_i){
		//console.log (start);
		
		if (start){
			var sticks_array = ['/', '-', '\\', '|', '/', '\u2013', '\\', '|'];
			
			$('#loading_indicator').html(sticks_array[load_i]);
			load_i++;
			if (load_i >= 7){load_i = 0;}
			if (!STOP_IT_NOW){
				setTimeout('loadingIndicator('+start+', '+load_i+')', 350);
			}else{
				$('#loading_indicator').html('');
			}
		}else{
			$('#loading_indicator').html('');
		}
	}
	
	//Обратный отсчет
	function timer_inp(data){
		//console.log(data);		
		
		$('#timer_inp').html('<span class="error_captcha">Еще одна попытка через: '+data+' сек.</span>');

		if(data == 0){
			//Пытаемся игнорировать капчу (работает пару раз подряд не более)
			tryToIgnoreCapctha();
		}else{

			setTimeout('timer_inp('+(data-1)+')', 1000);
		}
	}
	