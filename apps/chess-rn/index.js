import { AppRegistry } from 'react-native'
import App from '~/app/App'
import Services from '~/services/Services'
import { name } from './app.json'

const NativeApp = () => (
  <Services>
    <App />
  </Services>
)

AppRegistry.registerComponent(name, () => (NativeApp))
