import { port } from './config'
import app from '.'

app
	.listen(Number(port), () => {
			console.log(`Server is running on port: ${port}`)
	})
	.on('error', (err) => {
		console.error(`Error while starting the Server: ${err}`)
	})
