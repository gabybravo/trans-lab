$(document).ready(function(){
  	/* Menú retractil */
  	$(".button-collapse").sideNav();
  	$('.collapsible').collapsible();
  	/* SELECT */
  	$('select').material_select();

	/* Validación Index */
	$("#sesion").click(function(event){
    if(!(/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test($("#mail").val()))){
   			$("#mail").append($("#mail").val("Error"));
  		}
  		if(!(/^\d{8}([0-9])*$/.test($("#pass").val())) ){
   			$("#pass").append($("#pass").val("Error"));
  		}
  		else{
  			$("#sesion").attr("href","home.html");
        localStorage.setItem('mail',$("#mail").val());
        localStorage.setItem('num-tarjeta',$("#pass").val());       
  		}
	});

  
  	/* Mostrar e-mail en perfil */
  	var mail = localStorage.getItem('mail');
  	$('#correo-ingresado').html(mail); 

 	var arr = [];

  	/* Capturar valor Tarjetas BIP */
  	$("#btn-tarjeta").click(function() {
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
    console.log(localStorage.getItem('todas-tarjetas'));
    $("#tarjeta").val("");       
    }
  });

});

	/* Selección de Tarjeta a consultar */
  	var todasTarjetas = localStorage.getItem('todas-tarjetas');
  	var str = JSON.parse('[' + todasTarjetas + ']');
  	console.log(str);
  
  	str.forEach(function(e){
    $('#select').append(`<option value="`+e+`">`+e+`</option>`)
  	});

  	str.forEach(function(e){
    $('#select-tarjeta').append(`<option value="`+e+`">`+e+`</option>`)
  	});

	/* Saldo Tarjetas BIP */

  	$('#btn-ver-saldo').click(function(){
    	$("#saldo").empty();
    console.log($("#tarjeta-saldo").val());

    if(!(/^\d{8}([0-9])*$/.test($("#tarjeta-saldo").val())) ){
      $("#tarjeta-saldo").append($("#tarjeta-saldo").val("Error"));
    }else{     
      console.log($("#tarjeta-saldo").val());
      var valorTarjeta = $("#tarjeta-saldo").val();
      callbacksAjaxBip(valorTarjeta);
      $("#tarjeta-saldo").val("");
    }
  });

  	$('#btn-ver-saldo').click(function(){
    $("#saldo").empty();
    if($("#select").val() == ""){
      alert("Escoge una opción, por favor.")
    }else{      
      console.log($("#select").val());
      var valorTarjetaS = $("#select").val();
      callbacksAjaxBip(valorTarjetaS);
    }
  });

  	/* Llamar a la API */
  	var callbacksAjaxBip = function(num){
    $.ajax({
      url: 'http://bip-servicio.herokuapp.com/api/v1/solicitudes.json?bip=' + num,
      type: 'GET',
      dataType: 'json',
    })
    .done(function(response){    
      var saldo = response.saldoTarjeta; 
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