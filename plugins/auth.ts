import { Plugin } from '@nuxt/types'
import axios from 'axios'
import { ToastServiceMethods } from 'primevue/toastservice'
import { ErrorResponse, initializeAxios } from '~/utils'

declare module 'vue/types/vue' {
  interface Vue {
    $toast: ToastServiceMethods
  }
}
const auth: Plugin = ({ app, $auth, store }) => {
  const axiosInstance = axios.create()

  axiosInstance.interceptors.request.use((config: any) => {
    const token = app.$cookies.get('auth._token')
    console.log('BE_API_URL:', process.env.BE_API_URL);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    if ($auth.loggedIn && token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (process.env.NODE_ENV !== 'development') {
      if (config?.isThirdPartyAPI) {
        config.headers = null
        config.url = config.url
      }
      else { config.url = process.env.BE_API_URL + '/api' + config.url }
    } else {
      if (config?.isThirdPartyAPI) {
        config.headers = null
        config.url = config.url
      }
      else { config.url = process.env.BE_API_URL + '/api' + config.url }
    }
    // store.commit('commons/store-common/setViewLoading', true)
    return config
  }, (error) => {
    // store.commit('commons/store-common/setViewLoading', false)
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use((response) => {
    // store.commit('commons/store-common/setViewLoading', false)
    return response
  }, (error) => {

    if (error.response && error.response.status === 401) {
      $auth.logout()
    }
    else if (error.response && error.response.status === 403) {
      store.commit('commons/store-error/setError', "Không có quyền thực hiện hành động này!")
    }
    else if (error.response && error.response.status === 500) {
      store.commit('commons/store-error/setError', "Đã xảy ra lỗi, vui lòng thử lại sau")
    }
    const errorResponse: ErrorResponse = error.response.data

    if (errorResponse) {
      store.commit('commons/store-error/setError', errorResponse)
    }
    // store.commit('commons/store-common/setViewLoading', false)
    return Promise.reject(error)
  })

  initializeAxios(axiosInstance)
}

export default auth
