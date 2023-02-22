//this literally just remove typescript yelling that Alpine is not defined
import { Alpine as AlpineType } from 'alpinejs'

declare global {
    var Alpine: AlpineType
}
