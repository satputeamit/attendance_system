
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port );

  var ajax_call = function() {
    socket.emit("skt_handshake")
    console.log("called");
  }

  var interval =1000;
  setInterval(ajax_call, interval);

  socket.on("skt_handshake_response",data=>{
    if(data.flag){
      console.log("Connected");
    }
    else{
      console.log("NOT connected");
      alert('AIC not connected.')
      // $.get('/help');
  //     $.post("/allvariants",{data:''} ,function(data) {
  //     allVariants = data;
  //     console.log(allVariants);
  // }, "json");
  }

  });
