import { Readable, Writable, Transform } from 'node:stream';

class OneToHundredStream extends Readable {
  index = 1;

  _read() {
    const i  = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null); // push é uma forma de inserir algo na stream
      } else {
        const buf = Buffer.from(String(i)); // buffer é um tipo de formato utilizado na stream

        this.push(buf)
      }
    }, 250)
  }
}

class InverseNumberStream extends Transform {
  _transform(chunck, encoding, callback) {
    const transformed = Number(chunck.toString()) * -1;

    callback(null, Buffer.from(String(transformed)));
  }
}

class MultiplyByTenStream extends Writable {
  // chuck são as porções de dados sendo transicionadaos em uma stream;
  // callback é uma função a ser chamada para trabalhar com os dados recebidos que serão gravados.
  _write(chunck, encoding, callback) {
    console.log(Number(chunck.toString()) * 10);
    callback();
  }
}

new OneToHundredStream() // Stream de leitura 
  .pipe(new InverseNumberStream()) // Stream de transformação de dados
  .pipe(new MultiplyByTenStream()) // Stream para escrita
  