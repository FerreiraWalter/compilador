const lexer = require('./lexico');

const tokens = lexer("PROGRAM example; VAR x, y: STRING; BEGIN x := 5; y := 7; IF walter == TRUE THEN WRITE(x) ELSE WRITE(y) END.");

const tokensIterator = tokens[Symbol.iterator]();
let currentToken = tokensIterator.next().value;

function match(expectedTokenType) {
  if (currentToken.type === expectedTokenType) {
    console.log("[TOKEN ATUAL]: ", currentToken, "✅")
    const tokenValue = currentToken.value;
    currentToken = tokensIterator.next().value;
    return tokenValue;
  } else {
    console.log("[TOKEN ATUAL]: ", currentToken, "❌")
    throw new Error(
      `Unexpected token: ${currentToken.value}. Expected token of type ${expectedTokenType}.`
    );
  }
}

function prog() {
  match("PROGRAM");
  match("IDENTIFIER");
  match("PVIG");
  decls();
  cmd_comp();
  match("PONTO");
  console.log("Programa sintaticamente correto!");
}

function decls() {
  if (currentToken.type === "VAR") {
    match("VAR");
    list_decl();
  }
}

function list_decl() {
  decl_tip();
  while (currentToken.type === "IDENTIFIER") {
    decl_tip();
  }
}
function decl_tip() {
  list_id();
  match("DPONTOS");
  match("Tip");
  match("PVIG");
}

function list_id() {
  match("IDENTIFIER");
  while (currentToken.type === "VIG") {
    match("VIG");
    match("IDENTIFIER");
  }
}

function cmd_comp() {
  match("BEGIN");
  list_cmd();
  match("END");
}

function list_cmd() {
  cmd();
  while (currentToken.type === "PVIG") {
    match("PVIG");
    cmd();
  }
}

function cmd() {
  if (currentToken.type === "IF") {
    cmd_if();
  } else if (currentToken.type === "WHILE") {
    cmd_while();
  } else if (currentToken.type === "READ") {
    cmd_read();
  } else if (currentToken.type === "WRITE") {
    cmd_write();
  } else if (currentToken.type === "IDENTIFIER") {
    cmd_atrib();
  } else if (currentToken.type === "BEGIN") {
    cmd_comp();
  } else {
    throw new Error(`Unexpected token: ${currentToken.value}`);
  }
}

function cmd_if() {
  match("IF");
  expr();
  match("THEN");
  cmd();
  if (currentToken.type === "ELSE") {
    match("ELSE");
    cmd();
  }
}

function cmd_while() {
  match("WHILE");
  expr();
  match("DO");
  cmd();
}
function cmd_read() {
  match("READ");
  match("ABPAR");
  list_id();
  match("FPAR");
}

function cmd_write() {
  match("WRITE");
  match("ABPAR");
  list_w();
  match("FPAR");
}

function list_w() {
  elem_w();
  while (currentToken.type === "VIG") {
    match("VIG");
    elem_w();
  }
}

function elem_w() {
  if (currentToken.type === "CTE") {
    match("CTE");
  } else if (currentToken.type === "CADEIA") {
    match("CADEIA");
  } else {
    expr();
  }
}

function cmd_atrib() {
  match("IDENTIFIER");
  match("ATRIB");
  expr();
}

function expr() {
  term();
  while (currentToken.type === "OPAD") {
    match("OPAD");
    term();
  }
  if (currentToken.type === "OPREL") {
    match("OPREL");
    term();
  }
}

function term() {
  factor();
  while (currentToken.type === "OPMULT") {
    match("OPMULT");
    factor();
  }
}

function factor() {
  if (currentToken.type === "IDENTIFIER") {
    match("IDENTIFIER");
  } else if (currentToken.type === "CTE") {
    match("CTE");
  } else if (currentToken.type === "ABPAR") {
    match("ABPAR");
    expr();
    match("FPAR");
  } else if (currentToken.type === "OPNEG") {
    match("OPNEG");
    factor();
  } else if (currentToken.type === "TRUE") {
    match("TRUE");
  } else if (currentToken.type === "FALSE") {
    match("FALSE");
  } else {
    throw new Error(`Unexpected token: ${currentToken.value}`);
  }
}

prog();
