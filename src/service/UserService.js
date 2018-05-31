import BaseService from '../model/BaseService'
import _ from 'lodash'
import {USER_ROLE} from '@/constant'
import {api_request} from '@/util';

export default class extends BaseService {

    async login(username, password, opts={}){

        const userRedux = this.store.getRedux('user')

        // call API /login
        const res = await api_request({
            path : '/user/login',
            method : 'get',
            data : {
                username,
                password
            }
        });

        await this.dispatch(userRedux.actions.login_form_reset())

        await this.dispatch(userRedux.actions.is_login_update(true))

        if ([USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(res.user.role)) {
            await store.dispatch(userRedux.actions.is_admin_update(true))
        }

        await this.dispatch(userRedux.actions.profile_update(res.user.profile))
        await this.dispatch(userRedux.actions.role_update(res.user.role))

        sessionStorage.setItem('api-token', res['api-token']);

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
