$(document).ready(function(){
  	/* Menú retractil */
  	$(".button-collapse").sideNav();
  	$('.collapsible').collapsible();
  	/* SELECT */
  	$('select').material_select(); //Para inicializar el elemento select

	/* Validación Index */
	$("#sesion").click(function(event){
    if(!(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test($("#mail").val()))){
   			$("#mail").append($("#mail").val("Error"));
  		}
  		if(!(/^\d{8}([0-9])*$/.test($("#pass").val()))) {
   			$("#pass").append($("#pass").val("Error"));
  		} else {
  			$("#sesion").attr("href","home.html"); //Si se valida correctamente abre home.html
        localStorage.setItem('mail',$("#mail").val());
        localStorage.setItem('num-tarjeta',$("#pass").val());       
  		}
	});

  
  	/* Mostrar e-mail en perfil */
  	var mail = localStorage.getItem('mail'); //Devolver e-mail para mostrarlo en el html perfil
  	$('#correo-ingresado').html(mail); 

  	/* Capturar valor Tarjetas BIP */
  	var arr = [];
  	$("#btn-tarjeta").click(function() {
  	//Valido que el número de tarjeta tenga 8 dígitos:
    if(!(/^\d{8}([0-9])*$/.test($("#tarjeta").val())) ){
        $("#tarjeta").append($("#tarjeta").val("Error"));
    } else {

    var tarjetaIngresada = $("#tarjeta").val();
    arr.push(tarjetaIngresada);

    $("#tarjetas-creadas").append(`
       <div class="caja">
         <h6>`+ tarjetaIngresada +`</h6>
       </div>
     `);
      
    localStorage.setItem('todas-tarjetas',arr);
    $("#tarjeta").val("");       
    }
  });

});

	/* Selección de Tarjeta a consultar */
  	var todasTarjetas = localStorage.getItem('todas-tarjetas');
  	//El texto que va entre () se convertirá a JSON.
  	//Retorna el objeto que se corresponde con el texto JSON entregado.
  	var string = JSON.parse('[' + todasTarjetas + ']');
  	console.log(string);
  	
  	//Mostrar el valor de las tarjetas ingresadas en perfil.html en los select.
  	string.forEach(function(e){
    $('#select').append(`<option value="`+ e +`">`+ e +`</option>`)
  	});

  	string.forEach(function(e){
    $('#select-tarjeta').append(`<option value="`+ e +`">`+ e +`</option>`)
  	});

	/* Saldo Tarjetas BIP */
  	$('#btn-ver-saldo').click(function(){
    	$("#saldo").empty(); //Remueve todos los nodos hijos.
    console.log($("#tarjeta-saldo").val());
    //Validación del número de tarjeta BIP al escribirla en el input:
    if(!(/^\d{8}([0-9])*$/.test($("#tarjeta-saldo").val())) ){
      $("#tarjeta-saldo").append($("#tarjeta-saldo").val("Error"));
    } else {     
      console.log($("#tarjeta-saldo").val());
      var valorTarjeta = $("#tarjeta-saldo").val();
      callbackAjaxBip(valorTarjeta); //Llamo la API
      $("#tarjeta-saldo").val("");
    }
  });
  	//Validación del número de tarjeta BIP al escogerla del select:
  	$('#btn-ver-saldo').click(function(){
    $("#saldo").empty(); //Remueve todos los nodos hijos.
    if($("#select").val() == ""){
      alert("Escoge una opción, por favor.")
    } else {      
      console.log($("#select").val());
      var valorTarjetas = $("#select").val();
      callbackAjaxBip(valorTarjetas); //Llamo la API
    }
  });

  	/* Llamar a la API para mostrar saldo */
  	var callbackAjaxBip = function(num){
    $.ajax({
      url: 'http://bip-servicio.herokuapp.com/api/v1/solicitudes.json?bip=' + num,
      type: 'GET',
      dataType: 'json',
    })
    .done(function(response){    
      var saldo = response.saldoTarjeta; //Muestro saldo en el html
      $("#saldo").html(` 
        <div class="cont-saldo">
          <div class="row">
            <div class="col s12 center total-saldo">
              <h6>SALDO TOTAL</h6>
            </div>
          </div>
          <div class="row">
            <div class="col s12 center mostrar-saldo">
              <h4>`+ saldo +`</h4>
            </div>
          </div>
        </div> 
      `);
    });  
  }  

	/* Tarifa Tarjetas BIP */
	$('#btn-calcular').click(function() {
	   $("#calculo-tarifa").empty(); //Remueve todos los nodos hijos.
	   console.log($("#tarjeta-numero").val());

	   //Validación del número de tarjeta BIP al escribirla en el input:
	   if(!(/^\d{8}([0-9])*$/.test($("#tarjeta-numero").val()))) {
	      $("#tarjeta-numero").append($("#tarjeta-numero").val("Error"));
	    } else {  
	      callbackAjaxBipTarifa($("#tarjeta-numero").val()); //Llamo a la API
	    }
	  });
		//Validación de que el número de tarjeta BIP no esté vacío al escogerla del select:
	  	$('#btn-calcular').click(function() {
	    $("#calculo-tarifa").empty();
	    if($("#select-tarjeta").val() == "") {
	      alert("Escoge una opción, por favor.")
	    } else {      
	      console.log($("#select-tarjeta").val());
	      callbackAjaxBipTarifaSelect($("#select-tarjeta").val()); //Llamo a la API
	    }
	  });

	var callbackAjaxBipTarifa = function(num) {
	    $.ajax({
	      url: 'http://bip-servicio.herokuapp.com/api/v1/solicitudes.json?bip=' + num,
	      type: 'GET',
	      dataType: 'json',
	    })
	    .done(function(response) {    
	      var saldo = response.saldoTarjeta;
	      console.log(saldo);
	      //Slice devuelve una copia de una parte del array dentro de un nuevo array 
	      //empezando por inicio hasta fin (fin no incluido). El array original no se modificará.
	      var corte = saldo.slice(1,saldo.length);
	      var saldoFinal = corte.replace(".","");
	      console.log(saldoFinal);
	    // Validar que el select no esté vacío:
	    if($("#select-tarifa").val() == "") {
	        alert("Selecciona un horario válido, por favor.");
	      } else if ($("#select-tarifa").val() == "740") {
	        var alto = parseInt(saldoFinal) - 740;
	        console.log(alto);
	        var resultado = $("#calculo-tarifa").append(`
	          <div class="cont-valor-horario">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>COSTO PASAJE</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4> $740 </h4>
	              </div>
	            </div>
	          </div>           
	          <div class="cont-tarifa">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>SALDO FINAL</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4>$`+ alto +`</h4>
	              </div>
	            </div>
	          </div> 
	        `)
	        return resultado;        
	      } else if ($("#select-tarifa").val() == "680") {
	        var medio = parseInt(saldoFinal) - 680;
	        console.log(medio);
	        var resultado = $("#calculo-tarifa").append(`
	          <div class="cont-valor-horario">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>COSTO PASAJE</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4> $640 </h4>
	              </div>
	            </div>
	          </div>           
	          <div class="cont-tarifa">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>SALDO FINAL</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4>$`+ medio +`</h4>
	              </div>
	            </div>
	          </div> 
	        `)
	        return resultado;  
	      } else if ($("#select-tarifa").val() == "640") {
	        var bajo = parseInt(saldoFinal) - 640;
	        console.log(bajo);
	        var resultado = $("#calculo-tarifa").append(`
	          <div class="cont-valor-horario">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>COSTO PASAJE</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4> $640 </h4>
	              </div>
	            </div>
	          </div>           
	          <div class="cont-tarifa">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>SALDO FINAL</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4>$`+ bajo +`</h4>
	              </div>
	            </div>
	          </div> 
	        `)
	        return resultado; 
	      }                
	    });
	  }

	var callbackAjaxBipTarifaSelect = function(num){
	    $.ajax({
	      url: 'http://bip-servicio.herokuapp.com/api/v1/solicitudes.json?bip=' + num,
	      type: 'GET',
	      dataType: 'json',
	    })
	    .done(function(response){    
	      var saldo = response.saldoTarjeta;
	      console.log(saldo);
	      var corte = saldo.slice(1,saldo.length);
	      var saldoFinal = corte.replace(".","");
	      console.log(saldoFinal);

	    if ($("#select-tarifa").val() == "") {
	        alert("Selecciona un horario válido, por favor.");
	      } else if ($("#select-tarifa").val() == "740") {
	        var alto = parseInt(saldoFinal) - 740;
	        console.log(alto);
	        var resultado = $("#calculo-tarifa").append(`
	          <div class="cont-valor-horario">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>COSTO PASAJE</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4> $740 </h4>
	              </div>
	            </div>
	          </div>           
	          <div class="cont-tarifa">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>SALDO FINAL</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4>$`+ alto +`</h4>
	              </div>
	            </div>
	          </div> 
	        `)
	        return resultado;        
	      } else if ($("#select-tarifa").val() == "680") {
	        var medio = parseInt(saldoFinal) - 680;
	        console.log(medio);
	        var resultado = $("#calculo-tarifa").append(`
	          <div class="cont-valor-horario">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>COSTO PASAJE</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4> $680 </h4>
	              </div>
	            </div>
	          </div>           
	          <div class="cont-tarifa">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>SALDO FINAL</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4>$`+ medio +`</h4>
	              </div>
	            </div>
	          </div> 
	        `)
	        return resultado;  
	      } else if ($("#select-tarifa").val() == "640") {
	        var bajo = parseInt(saldoFinal) - 640;
	        console.log(bajo);
	        var resultado = $("#calculo-tarifa").append(`
	          <div class="cont-valor-horario">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>COSTO PASAJE</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4> $640 </h4>
	              </div>
	            </div>
	          </div>           
	          <div class="cont-tarifa">
	            <div class="row">
	              <div class="col s12 center total-saldo">
	                <h6>SALDO FINAL</h6>
	              </div>
	            </div>
	            <div class="row">
	              <div class="col s12 center mostrar-saldo">
	                <h4>$`+ bajo +`</h4>
	              </div>
	            </div>
	          </div> 
	        `)
	        return resultado; 
	      }                
	    });
	  } 
