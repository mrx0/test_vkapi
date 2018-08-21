	
				//url: 'https://api.vk.com/method/friends.search?count=500&user_id=148681572&v='+api_version
				//получаем Список друзей
				//url: 'https://api.vk.com/method/friends.search?count=500&access_token='+token+'&v='+api_version,
				//Получаем список видеозаписей, где пользователь поставил лайк
				//url: 'https://api.vk.com/method/fave.getVideos?count=10000&access_token='+token+'&v='+api_version,
				//Регистрация, получение токена
				//https://oauth.vk.com/authorize?client_id=6643746&display=page&redirect_uri=&scope=notifications,video,audio,friends,wall&response_type=token&v=5.52
	
	
	//Вводим капчу и двигаем дальше
	function useCaptchaAndMove (){
		//console.log ('submit_captcha');
		//console.log (url_session);
		//console.log (reqData_session);
		
		//текст, который ввел пользователь
		var captcha_key = $('#captcha_input').val();
		//полученный идентификатор капчи
		var captcha_sid = $('#captcha_input').attr('captcha_sid');
		//console.log (captcha_key);
		//console.log (captcha_sid);
		
		//Если хоть что-то ввели
		if (captcha_key.length > 0){
			
			//На всякий случай гасим оверлей
			overlayBlock (false, '');
			
			// !!! потом сделать отдельную функцию для выполнения запросов подобных, а не вот это вот всё
			//Пробуем удалить лайк с объекта по его id			
			
			// !!! брать это надо будет из сессии
			var url = url_session;
			// !!! брать это надо будет из сессии
			reqData = reqData_session;
			// !!! брать это надо будет из сессии
			reqData.access_token = token;
			//Добавим данные о капче в reqData
			reqData.captcha_key = captcha_key;
			reqData.captcha_sid = captcha_sid;
			//console.log (reqData);

			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'JSONP',
				data: reqData,
				success: function (res){
					//console.log (res);

					//Если нет ошибки
					if (res.error == undefined){
						
						$('#last_action').html('Удалён like c '+type+': '+reqData.item_id);
						
						$('#errors').html('');

						//Выставляем счетчик +1
						$('#deleted_items_count').html(deleted_items_count+1);
						
						//Небольшое отличие от основной функции удаления, тут мы сразу возвращаемся к основному запросу
						//Повторяем запрос через N секунд
						setTimeout(function(){
							//Разрешили продолжать и продолжаем
							stopOrStartItNow();
						}, Math.floor(1500*speed));
						
					//Если есть ошибка
					}else{
						// !!! заменить тут на добавление в сессию reqData и url
						delete reqData.access_token;
						url_session = url;
						reqData_session = reqData;
						
						ohNoErrors (res, 3);
					}
					
					
				},
				error: function (jqXHR) {
					console.log('jqXHR.status: ' + jqXHR.status);
				}
			});
			
		}else{
			$('#error_captcha').html('Вы ничего не ввели');
		}
		
	}
	
	//Трахаемся с качпой кучпой купчой блять нахуй капчой
	function fuckCaptcha (res){
		//console.log (res);
		
		var block4overlay = '';
		
		block4overlay += '<form id="captcha_mf" onsubmit="useCaptchaAndMove(); return false;">';
		block4overlay += '<div><img src='+res.error.captcha_img+'></div>';
		block4overlay += '<div id="error_captcha" class="error_captcha"></div>';
		block4overlay += '<div><input type="text" name="captcha_input" id="captcha_input" captcha_sid="'+res.error.captcha_sid+'"  class="captcha_input" autocomplete="off"></div>';
		block4overlay += '<div><input type="submit" class="b" value="Ok"></div>';		
		block4overlay += '<div id="timer_inp"></div>';		
		block4overlay += '</form>';	
		
		overlayBlock (true, block4overlay);
		
		$('#captcha_input').focus();
		
		timer_inp(20);
	}
	
	//Пытаемся игнорировать капчу
	function tryToIgnoreCapctha (){
		
		overlayBlock (false, '');
		STOP_IT_NOW = false;
		$('#errors').html('');
		getVKData();
		
	}
	
	//Фунция, вызываемая при ошибках API
	function ohNoErrors (res, code_place){
		//console.log (res);
		//console.log (res.error.error_code);
		//console.log (res.error.request_params);
		
		//Останавливаем выполнение
		stopOrStartItNow();	
		
		$('#errors').append('<div>#'+code_place+' '+res.error.error_msg+' ['+res.error.error_code+'] => '+res.error.request_params[4]['value']+' | '+res.error.request_params[5]['value']+'</div>');

		//Закончилась авторизация, надо перерегаться
		if (res.error.error_code == 5){
			// !!! переделать запрос авторизации на ajax get или post в отдельной функции
			$('#action').html('<div><a href="https://oauth.vk.com/authorize?client_id=6643746&display=page&redirect_uri=&scope=notifications,video,audio,friends,wall&response_type=token&v='+api_version+'">Войти</a></div>');
		}
		//Хочу капчу / Captcha needed
		if (res.error.error_code == 14){
			fuckCaptcha (res);
		}
	}
	
	//Удаляем лайки
	function deleteLike (token, DeleteItNow, deleted_items_count, type){
		//console.log(DeleteItNow);
		//console.log(DeleteItNow.length);
		
		//Включаем индикатор
		loadingIndicator(true, 0);
		
		//Если массив пуст
		if (DeleteItNow.length == 0){
			//Повторяем запрос через N секунд
			setTimeout(function(){
				getVKData();
			}, Math.floor(1500*speed));
			//return false;
		}else{
			var owner_id = DeleteItNow[0].owner_id;
			var item_id = DeleteItNow[0].id;
			//console.log(owner_id);
			//console.log(item_id);

			//Пробуем удалить лайк с объекта по его id			
			var url = 'https://api.vk.com/method/likes.delete';
		
			reqData = {
				type: type,
				owner_id: owner_id,
				item_id: item_id,
				v: api_version,
				access_token: token,
			};
		
			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'JSONP',
				data: reqData,
				success: function (res){
					//console.log (res);

					//Если нет ошибки
					if (res.error == undefined){
						//console.log('Удалён like c '+type+': '+item_id);
						
						$('#last_action').html('Удалён like c '+type+': '+item_id);
						
						//Удалили первый элемент массива
						DeleteItNow.splice(0, 1);
						//Выставляем счетчик +1
						$('#deleted_items_count').html(deleted_items_count+1);
						//Удаляем следующий через N секунд
						setTimeout(function(){
							deleteLike(token, DeleteItNow, deleted_items_count+1, type)
						}, Math.floor(1500*speed));
						
					//Если есть ошибка
					}else{
						// !!! заменить тут на добавление в сессию reqData и url
						delete reqData.access_token;
						url_session = url;
						reqData_session = reqData;
						
						ohNoErrors (res, 2);
					}
					
					
				},
				error: function (jqXHR) {
					console.log('jqXHR.status: ' + jqXHR.status);
					//Пример расшифровки кодов ошибок
					/*
					var msg = '';
					if (jqXHR.status === 0) {
						msg = 'Not connect.\n Verify Network.';
					} else if (jqXHR.status == 404) {
						msg = 'Requested page not found. [404]';
					} else if (jqXHR.status == 500) {
						msg = 'Internal Server Error [500].';
					} else if (exception === 'parsererror') {
						msg = 'Requested JSON parse failed.';
					} else if (exception === 'timeout') {
						msg = 'Time out error.';
					} else if (exception === 'abort') {
						msg = 'Ajax request aborted.';
					} else {
						msg = 'Uncaught Error.\n' + jqXHR.responseText;
					}
					console.log(msg);
					*/
					
					
				}
			});
		}
		
		
	}
	
	//Запрос данных из VK
	function getVKData (){
		//console.log (STOP_IT_NOW);

		if (!STOP_IT_NOW){
			
			//Получаем список фотографий, где пользователь поставил лайк
			var url = 'https://api.vk.com/method/fave.getPhotos';
		
			reqData = {
				count: 3,
				v: api_version,
				access_token: token,
			};
		
			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'JSONP',
				data: reqData,
				success: function (res){
					//console.log (res);
					//console.log (res.response.items);
					
					//На всякий случай гасим оверлей
					overlayBlock (false, '');
					
					//Если нет ошибки
					if (res.error == undefined){
						
						//Если есть данные по запросу
						if (res.response.count > 0){
							
							//Если мы еще не рисовали общее количество, то рисуем
							if (Number($('#items_count').html()) == 0){
								$('#items_count').html(res.response.count);
							}
							
							//console.log (res.response.count);
							
							//Если мы уже рисовали количество удаленных, то продолжаем накидывать счетчик
							if (Number($('#deleted_items_count').html) != 0){
								deleted_items_count = Number($('#deleted_items_count').html());
							}
							
							//Вызываем функцию для удаления и передаем ей массив
							setTimeout(function(){
								deleteLike(token, res.response.items, deleted_items_count, type);
							}, Math.floor(1000*speed));
							
						}
						
					//Если есть ошибка
					}else{
						// !!! заменить тут на добавление в сессию reqData и url
						delete reqData.access_token;
						url_session = url;
						reqData_session = reqData;
						
						ohNoErrors (res, 1);
					}
					
				},
				error: function (jqXHR) {
					console.log('jqXHR.status: ' + jqXHR.status);
					
				}
			});
		}else{
			//Гасим оверлей
			overlayBlock (false, '');
			
			$('#last_action').html('Остановлено');
		}
	}