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
    console.log(arr);

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