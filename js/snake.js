let cells = [];
let snakeHead = {x:9, y:8};
let snakeCells = [];
let primeiroMovimento = true;
let direcao = "cima";
let ultimaDirecao = "cima";
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
            if (ultimaDirecao == "dir") return // Para evitar voltas de 180
            direcao = "esq";
        }
        else if(event.key == "d" || event.key == "ArrowRight") {
            if (ultimaDirecao == "esq") return
            direcao = "dir";
        }
        else if(event.key == "w" || event.key == "ArrowUp") {
            if (ultimaDirecao == "baixo") return
            direcao = "cima";
        }
        else if(event.key == "s" || event.key == "ArrowDown" ) {
            if (ultimaDirecao == "cima") return
            direcao = "baixo";
        }
    });
    gameMove(true);
}

// Controla o fps do jogo
function gameMove(bool){
    if (bool){
        timer = setInterval(mover, 100);
    } else {
        clearInterval(timer);
    }
}


function mover(){
    // Para evitar virar 180 graus
    ultimaDirecao = direcao;
    switch (direcao){
        case "cima":
            ultimaDirecao
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

    // Para não deletar imediatamente a cobra quando inicia o jogo
    if (primeiroMovimento){
        setCell(lugar, "ocupied");
        snakeCells.push(lugar);
        primeiroMovimento = false;
        return;
    }
    // Se a célula possui comida aumenta a cobra, encerra o jogo se a cobra
    // está no tamanho máximo
    if (checkCell(lugar) == "food"){
        setCell(lugar, "ocupied");
        snakeCells.push(lugar);
        if (snakeCells.length == 320){
            alert("Você ganhou")
        } else {
            criarComida();
            return
        }
        return
    }

    // Marca o espaço ocupado pela cauda como vazia e remove a posição
    // da array
    setCell(snakeCells[0], "empty");
    snakeCells.shift();

    // Se está vazia a célula move para o lugar
    if (checkCell(lugar) == "ok"){
        setCell(lugar, "ocupied");
        snakeCells.push(lugar);

    // Se a célula está ocupada fim de jogo
    } else {
        alert("Game Over");
        reset(); //Compativel com codepen
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

function reset(){
    gameMove(false);
    for (let cell of cells){
        cell.className = "empty";
    }
    snakeHead = {x:9, y:8};
    snakeCells = [];
    primeiroMovimento = true;
    direcao = "cima";
    mover();
    criarComida();
    gameMove(true);
}