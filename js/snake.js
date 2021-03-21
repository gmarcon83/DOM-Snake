let cells = [];
let snakeHead = {x:9, y:8};
let snakeCells = [];
let primeiroMovimento = true;
let direcao = "cima";
let timer;

// Monta a grade, inicializa a cobra, adiciona os eventos do teclado
window.onload = function(){
     for (let i=0; i<320; i++){
         let cell = new GridCell();
         document.getElementById("playfield").appendChild(cell)
         cells.push(cell);
    }
    mover();
    criarComida();
    // Parte responsavel pelo imput do usuário
    document.addEventListener('keydown', function(event) {
        if(event.key == "a" || event.key == "ArrowLeft") {
            direcao = "esq";
        }
        else if(event.key == "d" || event.key == "ArrowRight") {
            direcao = "dir";
        }
        else if(event.key == "w" || event.key == "ArrowUp") {
            direcao = "cima";
        }
        else if(event.key == "s" || event.key == "ArrowDown" ) {
            direcao = "baixo";
        }
    });
    gameMove(true);
}

function gameMove(bool){
    if (bool){
        timer = setInterval(mover, 100);
    } else {
        clearInterval(timer);
    }
}


function mover(){
    switch (direcao){
        case "cima":
            if (snakeHead.y == 0)
                snakeHead.y = 15;
            else
                snakeHead.y--;
            break;
        case "baixo":
            if (snakeHead.y == 15)
                snakeHead.y = 0;
            else
                snakeHead.y++;
            break;
        case "esq":
            if (snakeHead.x == 0)
                snakeHead.x = 19;
            else
                snakeHead.x--;
            break;
        case "dir":
            if (snakeHead.x == 19)
                snakeHead.x = 0;
            else
                snakeHead.x++;
            break;
    }
    let lugar = gridCalc(snakeHead.x, snakeHead.y);

    // Se está vazia a célula move para o lugar
    if (checkCell(lugar) == "ok"){
        setCell(lugar, "ocupied");
        snakeCells.push(lugar);
        // Para não deletar imediatamente a cobra quando inicia o jogo
        if (primeiroMovimento){
            primeiroMovimento = false;
            return;}
        // Marca o espaço ocupado pela cauda como vazia e remove a posição
        // da array
        setCell(snakeCells[0], "empty");
        snakeCells.shift();

    // Se a célula possui comida aumenta a cobra, encerra o jogo se a cobra
    // está no tamanho máximo
    } else if (checkCell(lugar) == "food"){
        setCell(lugar, "ocupied");
        snakeCells.push(lugar);
        if (snakeCells.length == 320){
            alert("Você ganhou")
        } else {
            criarComida();
            return
        }

    // Se a célula está ocupada fim de jogo
    } else {
        alert("Game Over");
        location.reload();
    }

}

// Transforma uma cordenada x y para a posiçao da array
function gridCalc (x, y){
    let pos = x + y * 20;
    return pos;
}

// Muda o status da celula cell
function setCell(cell, status){
    cells[cell].className = status
}

// Cria uma nova celula
function GridCell() {
    let cell = document.createElement("div")
    cell.classList.add("empty");
    cell.addEventListener('click', checkCell);
    return cell
 }

// Cria uma nova comida em um lugar vazio, talvez tenha
// que otimizar isso, vai ser bem ineficiente quando a
// cobra tiver grande
function criarComida(){
    let lugar;
    do {
       lugar = Math.floor(Math.random() * 320);
    } while (checkCell(lugar) != "ok");
    setCell(lugar, "food");
}

// Retorna o status da celula
function checkCell(elem){
    let cell = cells[elem];
    if (cell.className == "empty")
        return "ok"
    if (cell.className == "food")
        return "food"
    else
        return "end"
}