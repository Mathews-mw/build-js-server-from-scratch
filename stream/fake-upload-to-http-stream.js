import { Readable } from 'node:stream';

class OneToHundredStream extends Readable {
  index = 1;

  _read() {
    const i  = this.index++

    setTimeout(() => {
      if (i > 50) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));

        this.push(buf)
      }
    }, 250)
  }
}

fetch('http://localhost:3334', {
  method: 'POST',
  body: new OneToHundredStream(),
  duplex: 'half',
}).then(response => {
  return response.text();
}).catch(data => {
  console.logo(data);
})