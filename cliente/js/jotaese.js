/* ************************************************************************* */

// LLAMAR A LA API DE FORMA REMOTA O LOCAL *************************

// REMOTA
var url = "https://cuatroymedio.net:5050";

// LOCAL
//var url = "http://localhost:5050";

/* ************************************************************************* */

function refrescar(){

  $("#nuevoacordion").empty();

  counter = 1;
  epp = 20;

  $('html, body').animate({scrollTop:0}, 500, function(){
    carga_datos(0, aut);
  });

}

function ponerPuestosb(res){

  var json = JSON.parse(res);
  //console.log(json)

  var lacadena = ``;

  json.forEach(function (item, index) {

    //console.log(item.nombre + " - " + puesto)
  
    lacadena += `
      <option value="${item.id}">${item.nombre}</option>
    `;

    if(index == (json.length-1)){

      $("#elpuestoguardar").empty();
      $('#elpuestoguardar').append(lacadena);

    }

  });

}

function muestraModalguardarpersona(){

  var elem = document.querySelector('#modal3');
  var instance = M.Modal.getInstance(elem);

  instance.options.dismissible = false;

  var myHeaders = new Headers();
  myHeaders.append("authorization", aut);
  myHeaders.append("Content-Type", "application/json");

  //var raw = {};

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    //body: raw,
    redirect: 'follow'
  };

  var link = `${url}/api/personas/puestos`;

  fetch(link, requestOptions)
    .then(response => response.text())
    .then(result => ponerPuestosb(result))
    .catch(error => console.log('error', error));

    $("#nombreguardar").val('');
    $("#apguardar").val('');
    $("#amguardar").val('');
    $("#emailguardar").val('');

  instance.open();

}

function resultadoGuardar(res, elid){

  var json = JSON.parse(res);
  console.log(json);

  $("#cargadorsave").hide();

  if(json.status){

    var elem = document.querySelector('#modal3');
    var instance = M.Modal.getInstance(elem);

    instance.close();

    var mensaje = `<strong>${json.message}!</strong>`;
    
    M.toast({html: mensaje, classes: 'rounded green'});

    $("#nuevoacordion").empty();

    counter = 1;
    epp = 20;

    $('html, body').animate({scrollTop:0}, 500, function(){
      carga_datos(0, aut);
    });


  }

}

function guardarPersona(){

  var myHeaders = new Headers();
  myHeaders.append("authorization", aut);
  myHeaders.append("Content-Type", "application/json");

  var nombre = $("#nombreguardar").val();
  var ap = $("#apguardar").val();
  var am = $("#amguardar").val();
  var email = $("#emailguardar").val();
  var puestoid = $("#elpuestoguardar").val();
  var puestonombre = $("#elpuestoguardar option:selected" ).text();

  if (nombre == null || nombre == "") {

    var mensaje = `<strong>El campo nombre no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#nombreguardar").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (ap == null || ap == "") {

    var mensaje = `<strong>El campo Apellido Paterno no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#apguardar").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (am == null || am == "") {

    var mensaje = `<strong>El campo Apellido Materno no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#amguardar").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (email == null || email == "") {

    var mensaje = `<strong>El campo Email no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#emailguardar").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (!validarEmail(email)) {

    var mensaje = `<strong>El campo Email no es valido!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#emailguardar").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (puestoid == null || puestoid == "" || puestoid == 0) {

    var mensaje = `<strong>Debe seleccionar un puesto!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#elpuestoguardar").focus(); }, classes: 'rounded red'});

    return false;

  }

  $("#cargadorsave").show();

  var raw = JSON.stringify({
    "nombre": nombre,
    "ap": ap,
    "am": am,
    "email": email,
    "status": true,
    "nombrepuesto": puestonombre,
    "idpuesto": puestoid
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  var link = `${url}/api/personas/`;

  fetch(link, requestOptions)
    .then(response => response.text())
    .then(result => resultadoGuardar(result))
    .catch(error => console.log('error', error));

}

function resultadoEliminar(res, elid){

  var json = JSON.parse(res);
  console.log(json);

  //var elE = `#renglon_${elid}`;

  var elem = document.querySelector('#modal2');
  var instance = M.Modal.getInstance(elem);

  instance.close();

  $(`#renglon_${elid}`).animate({ opacity: '.125' }, 250, function () {

    $(this).animate({ opacity: '1' }, 125, function () {

      $(this).slideUp(500, function () {

        $(this).remove();
    
        var mensaje = `<strong>Los datos se eliminaron!</strong>`;
    
        M.toast({html: mensaje, classes: 'rounded green'});
    
      });

    });

  });

}

function eliminaPersona(){

  $("#cargadordelete").show();

  var myHeaders = new Headers();
  myHeaders.append("authorization", aut);

  var elid = $("#elideliminar").val();

  var raw = {};

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  var link = `${url}/api/personas/${elid}`

  fetch(link, requestOptions)
    .then(response => response.text())
    .then(result => resultadoEliminar(result, elid))
    .catch(error => console.log('error', error));

}

function eliminarPersona(obj){

  var elem = document.querySelector('#modal2');
  var instance = M.Modal.getInstance(elem);

  instance.options.dismissible = false;

  var nombrecompleto = `${obj.nombre} ${obj.ap} ${obj.am}`
  var mensaje = `Esta accion eliminara los datos de <br /><b>${nombrecompleto}</b>`;
  $("#mensajemodaleliminar").html(mensaje);
  
  $("#elideliminar").attr("value", obj.id);

  $("#cargadordelete").hide();

  instance.open();

}

function resultadoIniciarsesion(res, elid){

  var json = JSON.parse(res);
  console.log(json);

  if(json.status){

    console.log("OK");

    $("#btnlogin").prop('disabled', false);
    var cadena = `Login<i class="material-icons right">send</i>`;
    $("#btnlogin").html(cadena);

    $("#ellogin").slideUp(500, function () {

      $("#elacordion").animate({ opacity: '0' }, 1, function () { 
        $(this).show();
        $(this).animate({ opacity: '1' }, 1000, function () {
          
          //$("#btnnuevo").show();
          $("#linknuevo").show();

          $("#btnnuevo").animate({ opacity: '0' }, 1, function () { 
            $(this).show();
            $(this).animate({ opacity: '1' }, 1000, function () {
            });
          });

          $("#btnrefresh").animate({ opacity: '0' }, 1, function () { 
            $(this).show();
            $(this).animate({ opacity: '1' }, 1000, function () {
            });
          });

        });
      });

      aut = json.token;

      carga_datos(0, json.token);

    });

  }
  else{

    console.log("NO-OK");

    $("#btnlogin").prop('disabled', false);
    var cadena = `Login<i class="material-icons right">send</i>`;
    $("#btnlogin").html(cadena);

    M.toast({html: '<strong>Usuario o Contraseña incorrectos!</strong>', completeCallback: function(){ $("#user").focus(); }, classes: 'rounded red'});

  }

}

function iniciarsesion(){

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var user = $("#user").val();
  var pass = $("#pass").val();

  if (user == null || user == "") {

    var mensaje = `<strong>El campo usuario no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#user").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (pass == null || pass == "") {

    var mensaje = `<strong>El campo password no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#pass").focus(); }, classes: 'rounded red'});

    return false;

  }

  var raw = JSON.stringify({
    "usuario": user,
    "contrasena": pass
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  $("#btnlogin").prop('disabled', true);
  
  var cadena = `
  <div style="margin-top: 10px;" class="preloader-wrapper small active">
    <div class="spinner-layer spinner-yellow-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div>
      <div class="gap-patch">
        <div class="circle"></div>
      </div>
      <div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>`;

  $("#btnlogin").html(cadena);

  var link = `${url}/api/personas/autenticar`;

  fetch(link, requestOptions)
    .then(response => response.text())
    .then(result => resultadoIniciarsesion(result))
    .catch(error => console.log('error', error));
}

function resultadoActualizar(res, elid){

  var json = JSON.parse(res);
  console.log(json);

  var nombre = $("#nombre").val();
  var ap = $("#ap").val();
  var am = $("#am").val();

  var nombrecompleto = `${nombre} ${ap} ${am}`;
  var email = $("#email").val();
  var nombrepuesto = $("#elpuesto option:selected" ).text();

  $(`#renglon_${elid}`).animate({ opacity: '.125' }, 250, function () {

    $(this).animate({ opacity: '1' }, 125, function () {

      $(`#test1${elid}`).text(nombrecompleto);
      $(`#nombrecompleto${elid}`).text(nombrecompleto);

      $(`#test2${elid}`).text(email);
      $(`#test3${elid}`).text(nombrecompleto);
      
      $(`#link_${elid}`).attr('data-nombre', $("#nombre").val());
      $(`#link_${elid}`).attr('data-ap', $("#ap").val());
      $(`#link_${elid}`).attr('data-am', $("#am").val());
      $(`#link_${elid}`).attr('data-email', email);
      $(`#link_${elid}`).attr('data-nombrepuesto', nombrepuesto);
      $(`#link_${elid}`).attr('data-idpuesto', $("#elpuesto").val());

      $(`#linkb_${elid}`).attr('data-nombre', $("#nombre").val());
      $(`#linkb_${elid}`).attr('data-ap', $("#ap").val());
      $(`#linkb_${elid}`).attr('data-am', $("#am").val());
      $(`#linkb_${elid}`).attr('data-email', email);
      $(`#linkb_${elid}`).attr('data-nombrepuesto', nombrepuesto);
      $(`#linkb_${elid}`).attr('data-idpuesto', $("#elpuesto").val());

      $("#cargadorupdate").hide();

      var elem = document.querySelector('#modal1');
      var instance = M.Modal.getInstance(elem);

      instance.close();

      var mensaje = `<strong>Los datos de ${nombre} se actualizaron!</strong>`;

      M.toast({html: mensaje, classes: 'rounded green'});

        /* $("#modalmensaje").modal('hide');
        $("#campobuscar").focus();

        $("#divlalista").removeClass("blur");
        $("#paginacion").removeClass("blur"); */

    })
})

}

function validarEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function actualizaPersona(){

  var myHeaders = new Headers();
  myHeaders.append("authorization", aut);
  myHeaders.append("Content-Type", "application/json");

  var nombre = $("#nombre").val();
  var ap = $("#ap").val();
  var am = $("#am").val();
  var email = $("#email").val();
  var puestoid = $("#elpuesto").val();
  var puestonombre = $("#elpuesto option:selected" ).text();

  if (nombre == null || nombre == "") {

    var mensaje = `<strong>El campo nombre no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#nombre").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (ap == null || ap == "") {

    var mensaje = `<strong>El campo Apellido Paterno no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#ap").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (am == null || am == "") {

    var mensaje = `<strong>El campo Apellido Materno no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#am").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (email == null || email == "") {

    var mensaje = `<strong>El campo Email no puede estar vacío!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#email").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (!validarEmail(email)) {

    var mensaje = `<strong>El campo Email no es valido!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#email").focus(); }, classes: 'rounded red'});

    return false;

  }

  if (puestoid == null || puestoid == "" || puestoid == 0) {

    var mensaje = `<strong>Debe seleccionar un puesto!</strong>`;

    M.toast({html: mensaje, completeCallback: function(){ $("#elpuesto").focus(); }, classes: 'rounded red'});

    return false;

  }

  $("#cargadorupdate").show();

  var elid = $("#elid").val();

  var raw = JSON.stringify({
    "nombre": nombre,
    "ap": ap,
    "am": am,
    "email": email,
    "status": true,
    "nombrepuesto": puestonombre,
    "idpuesto": puestoid
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  var link = `${url}/api/personas/${elid}`

  fetch(link, requestOptions)
    .then(response => response.text())
    .then(result => resultadoActualizar(result, elid))
    .catch(error => console.log('error', error));

}

function ponerPuestos(res, puesto){

  var json = JSON.parse(res);
  //console.log(json)

  var lacadena = ``;

  json.forEach(function (item, index) {

    //console.log(item.nombre + " - " + puesto)

    var seleccionado = "";

    if(item.nombre == puesto){

      seleccionado = "selected";

    }
  
    lacadena += `
      <option value="${item.id}" ${seleccionado}>${item.nombre}</option>
    `;

    if(index == (json.length-1)){

      $("#elpuesto").empty();
      $('#elpuesto').append(lacadena);

    }

  });

}

function muestramodaleditar(obj){

  var elem = document.querySelector('#modal1');
  var instance = M.Modal.getInstance(elem);

  instance.options.dismissible = false;

  console.log(obj)
  //console.log(instance.options)

  $("#nombre").val(obj.nombre)
  $("#nombre").attr("value", obj.nombre);

  $("#ap").val(obj.ap)
  $("#ap").attr("value", obj.ap);

  $("#am").val(obj.am)
  $("#am").attr("value", obj.am);

  $("#email").val(obj.email)
  $("#email").attr("value", obj.email);

  $("#elid").attr("value", obj.id);

  var myHeaders = new Headers();
  myHeaders.append("authorization", aut);
  myHeaders.append("Content-Type", "application/json");

  //var raw = {};

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    //body: raw,
    redirect: 'follow'
  };

  var link = `${url}/api/personas/puestos`;

  fetch(link, requestOptions)
    .then(response => response.text())
    .then(result => ponerPuestos(result, obj.nombrepuesto))
    .catch(error => console.log('error', error));

  M.updateTextFields();

  //instance.dismissible = false;

  instance.open();

}

function muestradatos(res, epp){

  var json = JSON.parse(res);

  //console.log(json)

  if(json.length>0){

    var lacadena = ``;

    json.forEach(function (item, index) {

        // console.log(item)

        var nombre = `${item.nombre} ${item.ap} ${item.am} `;

        lacadena += `
          <li id="renglon_${item.id}">

              <!-- <div id="cargador${item.id}" class="progress">
                <div class="indeterminate"></div>
              </div> -->

              <div class="collapsible-header" tabindex="0">
                <i class="material-icons">account_circle</i> <!-- ${epp}${index} - ${nombre} --> <div id="nombrecompleto${item.id}" class="col s12">${nombre}</div>

                  <!-- <div id="cargador${item.id}" class="right preloader-wrapper small active">
                    <div class="spinner-layer spinner-blue-only">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div>
                        <div class="gap-patch">
                            <div class="circle"></div>
                        </div>
                        <div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>
                  </div> -->

              </div>

              <div class="collapsible-body">
                  
                <div class="row">
                  <div class="col s12">
                    <ul class="tabs">
                      <li class="tab col s4"><a class="active" href="#test1${item.id}">Nombre</a></li>
                      <li class="tab col s4"><a href="#test2${item.id}">Email</a></li>
                      <li class="tab col s4"><a href="#test3${item.id}">Puesto</a></li>
                    </ul>
                  </div>
                  <div style="margin-top:10px; font-weight:bold;" id="test1${item.id}" class="col s12">${nombre}</div>
                  <div style="margin-top:10px; font-weight:bold;" id="test2${item.id}" class="col s12">${item.email}</div>
                  <div style="margin-top:10px; font-weight:bold;" id="test3${item.id}" class="col s12">${item.nombrepuesto}</div>
                </div>

                <a id="link_${item.id}"
                  data-id="${item.id}"
                  data-nombre="${item.nombre}"
                  data-ap="${item.ap}"
                  data-am="${item.am}"
                  data-email="${item.email}"
                  data-nombrepuesto="${item.nombrepuesto}"
                  data-idpuesto="${item.idpuesto}"
                  onclick="muestramodaleditar(this.dataset)"
                  class="btn-floating tooltipped btn-small waves-effect waves-light orange" data-position="bottom" data-tooltip="I am a tooltip">
                  <i class="material-icons">edit</i>
                </a>

                <a id="linkb_${item.id}"
                  data-id="${item.id}"
                  data-nombre="${item.nombre}"
                  data-ap="${item.ap}"
                  data-am="${item.am}"
                  data-email="${item.email}"
                  data-nombrepuesto="${item.nombrepuesto}"
                  data-idpuesto="${item.idpuesto}"
                  onclick="eliminarPersona(this.dataset)"
                  class="btn-floating btn-small waves-effect waves-light orange">
                  <i class="material-icons">delete</i>
                </a>

                <!-- <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a> -->

              </div>
          </li>
        `;

        if(index == (json.length-1)){

            //console.log('Se acabo!');

            //$("#nuevoacordion").empty();
            //lacadena += '<hr>';
            //$('#myScroll').append(lacadena);
            $('#nuevoacordion').append(lacadena);

            $('.tabs').tabs();

            $("#cargadorb").hide();
        }

    });
  }
  else{
    if(json.mensaje==undefined){

      $("#cargadorb").hide();

      //alert('NO HAY MAS DATOS')

    }
    else{

      alert(json.mensaje)

    }
  }

}

function carga_datos(epp, stra) {

  $("#cargadorb").show();

  var myHeaders = new Headers();
  myHeaders.append("authorization", stra);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "epp": epp
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  var link = `${url}/api/personas/paginacion`;

  fetch(link, requestOptions)
    .then(response => response.text())
    .then(result => muestradatos(result, epp))
    .catch(error => console.log('error', error));

}