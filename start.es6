/**
 * Created by michaelsilvestre on 19/04/15
 */

import App from "./app"
import Bootstrap from './lib/bootstrap.js'

let bootstrap = new Bootstrap(App);
bootstrap.run();

//import Identify from './lib/identify.js'

/*let identify = new Identify();
identify.user((err, result) => {
    if (err) throw err;
    console.log(result);
});*/
//let app = App();
