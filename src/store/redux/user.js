import BaseRedux from '@/model/BaseRedux';

class UserRedux extends BaseRedux {
    defineTypes() {
        return ['user'];
    }

    defineDefaultState() {
        return {
            is_login : false,
            contract : null,
            web3 : null,
            wallet : null,

            login_form : {
                privatekey : '',
                loading : false
            },

            profile : {

            }
        };
    }
}

export default new UserRedux()
