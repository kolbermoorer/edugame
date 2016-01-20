function updateLoadingScreen(event) {
    var time = Math.floor($("#loadingTime").attr("ms"));
    time = time - Math.floor(event.delta);
    if(time >= 0) {
        var sec = Math.floor((time / 1000)) % 60;
        $("#loadingTime").attr("ms", time )
        $("#loadingTime").text(sec);
    }
    else {
    }
}

function singePlayerMove() {
    var backSide = selectedCard.children[0];
    var frontSide = selectedCard.children[1];

    createjs.Tween.get(selectedCard, { loop: false })
        .to({ x: BOARD_WIDTH+((STAGE_WIDTH-BOARD_WIDTH)/2), y: BOARD_HEIGHT/3}, 700, createjs.Ease.getPowInOut(4))
        .call(function() {
            createjs.Tween.get(backSide, {loop: false})
                .to({scaleX: 0}, 300)
                .call(function () {
                    createjs.Tween.get(frontSide, {loop: false})
                        .to({scaleX: 1, scaleY: 1}, 300)
                        .call(showQuestion);
                });
        });
}