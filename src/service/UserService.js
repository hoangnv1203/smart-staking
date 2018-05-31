import BaseService from '../model/BaseService'
import Web3 from 'web3'
import _ from 'lodash'
import WalletService from '@/service/WalletService'
import {WEB3} from '@/constant'

export default class extends BaseService {

    async initWeb3(){
        this.web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))
        const SmartTaking = web3.eth.contract(WEB3.API)
        const smartTaking = SmartTaking.at(WEB3.ADDRESS_CONTRACT)
        this.web3.eth.defaultAccount = WEB3.ACCOUNT

        await this.dispatch(userRedux.actions.contract_update(smartTaking))
        await this.dispatch(userRedux.actions.web3_update(this.web3))
    }

    async decryptWallet(privatekey, opts={}){
        const userRedux = this.store.getRedux('user')
        this.initWeb3()
        const wallet = new WalletService(privatekey)
        const walletAddress = wallet.getAddressString()

        if (!walletAddress) {
            return
        }

        wallet.balance = this.web3.eth.getBalance(walletAddress)
         await this.dispatch(userRedux.actions.login_form_reset())
        await this.dispatch(userRedux.actions.is_login_update(true))
        await this.dispatch(userRedux.actions.wallet_update(wallet))

        return true
    }

    async register(username, password, profile) {
        // const res = await api_request({
        //     path : '/user/register',
        //     method : 'post',
        //     data : {
        //         "username": "jacky2",
        //         "password": "password",
        //         "email": "test@elastos.org",
        //         "firstName": "Jacky11",
        //         "lastName": "Li22",
        //         "country": "China",
        //         "city": "Dalian"
        //     }
        // });

    }

    async logout(){
        const userRedux = this.store.getRedux('user')
        const tasksRedux = this.store.getRedux('task')

        return new Promise((resolve)=>{
            this.dispatch(userRedux.actions.is_login_update(false))
            this.dispatch(userRedux.actions.profile_reset())
            this.dispatch(tasksRedux.actions.all_tasks_reset())
            sessionStorage.clear()
            resolve(true)
        })
    }

    async changeStep(step) {
        const userRedux = this.store.getRedux('user')

        await this.dispatch(userRedux.actions.register_form_update({
            step: 2
        }))

        return true
    }
}
