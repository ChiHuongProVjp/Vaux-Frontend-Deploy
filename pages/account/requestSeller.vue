//Request seller
<template>
  <section class="surface-0 flex align-items-center justify-content-center min-h-screen overflow-hidden p-2">
    <div class="userdetails-page-container flex flex-column ">
      <h3>Đăng ký tài khoản người bán</h3>
      <div class="grid">
        <div class="col-2"></div>
        <div class="col-8">
          <div class="card-control">
            <div class="card-header font-medium text-xl">
              Thông tin yêu cầu nâng quyền tài khoản
            </div>
            <div class="p-5 grid grid-form">
              <div class="field col-12">
                <label>
                  {{ fieldLabels.name }}
                </label>
                <InputText class="w-100" v-model="name" disabled>
                </InputText>
              </div>
              <div class="field col-6">
                <label>{{ fieldLabels.gender }}</label>
                <Dropdown class="w-100" :class="{ 'p-invalid': errors.gender }" v-model="gender" :options="oGenders"
                  optionLabel="name" optionValue="value" />
              </div>
              <div class="field col-6">
                <label>{{ fieldLabels.dob }}</label><br />
                <Calendar class="surface-overlay w-100" :class="{ 'p-invalid': errors.dob }" v-model="dob"
                  dateFormat="dd-mm-yy">
                </Calendar>
              </div>
              <div class="field col-6">
                <label>{{ fieldLabels.phone }}</label>
                <InputText class="w-100" :class="{ 'p-invalid': errors.phone }" type="text" v-model="phone" />
              </div>
              <div class="field col-6">
                <label>{{ fieldLabels.email }}</label>
                <InputText class="w-100" :class="{ 'p-invalid': errors.email }" type="text" v-model="email" />
              </div>
              <div class="field col-12">
                <label>{{ fieldLabels.cccd }}</label>
                <InputText class="w-100" :class="{ 'p-invalid': errors.cccd }" type="text" v-model="cccd" />
              </div>
              <div class="field col-4">
                <label>{{ fieldLabels.city }}</label>
                <Dropdown class="w-100 line-height-1" :class="{ 'p-invalid': errors.city }" v-model="selectedCity"
                  :options="oCitys" :filter="true" filterPlaceholder="Tìm kiếm" optionLabel="name"
                  placeholder="-Chọn Thành phố-" @change="onSelectCity()" />
              </div>
              <div class="field col-4">
                <label>{{ fieldLabels.district }}</label>
                <Dropdown class="w-100 line-height-1" :class="{ 'p-invalid': errors.district }" v-model="selectedDistrict"
                  :options="oDistricts" :filter="true" filterPlaceholder="Tìm kiếm" optionLabel="name"
                  placeholder="-Chọn Quận/Huyện-" @change="getStreet()" />
              </div>
              <div class="field col-4">
                <label>{{ fieldLabels.street }}</label>
                <Dropdown class="w-100 line-height-1" :class="{ 'p-invalid': errors.street }" v-model="street"
                  :options="oStreets" :filter="true" filterPlaceholder="Tìm kiếm" optionLabel="name"
                  placeholder="-Chọn Phố/Phường-" optionValue="value" />
              </div>
              <div class="field col-12">
                <label>
                  {{ fieldLabels.houseNumber }}
                </label>

                <InputText class="w-100" :class="{ 'p-invalid': errors.houseNumber }" type="text" v-model="houseNumber" />
              </div>

              <div class="field col-6">
                <label>{{ fieldLabels.filePortrait }}</label>
                <div :class="{ 'input-invalid': errors.filePortrait }"
                  class="w-100 text-center surface-overlay p-1 border-1 border-solid surface-border border-10 w-full">
                  <ImagePreview :src="portraitUrl || require('~/assets/images/default.jpg')" alt="Image"
                    imageClass="w-max-100" imageStyle="height:200px;object-fit: contain" />
                  <div class="small font-italic text-muted mb-2">
                    JPG or PNG no larger than 3 MB
                  </div>
                  <input type="file" @change="onUploadFile($event, 'Portrait')" accept="image/*" />
                </div>
              </div>
              <div class="field col-6">
                <label>{{ fieldLabels.fileCitizenId }}</label>
                <div :class="{ 'input-invalid': errors.fileCitizenId }"
                  class="w-100 text-center surface-overlay p-1 border-1 border-solid surface-border border-10 w-full">
                  <ImagePreview :src="citizenIdUrl || require('~/assets/images/default.jpg')
                    " imageClass="w-max-100" imageStyle="height:200px;" alt="Image" />
                  <div class="small font-italic text-muted mb-2">
                    JPG or PNG no larger than 3 MB
                  </div>
                  <input type="file" @change="onUploadFile($event, 'CitizenId')" accept="image/*" />
                </div>
              </div>
              <div class="field col-6">
                <label>Ngân hàng</label>
                <Dropdown class="w-100 line-height-1" :class="{ 'p-invalid': errors.city }" v-model="selectedBank"
                  :options="oBanks" :filter="true" filterPlaceholder="Tìm kiếm" optionLabel="name"
                  placeholder="-Chọn Ngân hàng-" @change="onSelectBank()" />
              </div>
              <div class="field col-6">
                <label>Số tài khoản</label>
                <InputText class="w-100" type="text" v-model="bankAccountNum" />
              </div>
              <div class="field col-12">
                <label>{{ fieldLabels.content }}</label>
                <Textarea class="text-left w-full" v-model="content" rows="15" cols="100"
                  :class="{ 'input-invalid': errors.content }"
                  placeholder="Ví dụ: Tôi sẽ bán các sản phẩm đồ gia dụng cổ" />
              </div>
              <div class="field col-12">
                <BlockUI :blocked="disableButton">
                  <Button label="Yêu cầu" @click="onSubmit()" />
                </BlockUI>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
      
<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'
import { GENDER_OPTION } from '~/utils'
import { User } from '~/models/User'
import { Option } from '~/models/Option'
const nsStoreAddress = namespace('address/store-address')
const nsStoreBank = namespace('bank/store-bank')
const nsStoreSeller = namespace('seller/store-seller')
const nsStoreUser = namespace('user-auth/store-user')

@Component({
  layout: 'public',
  middleware: ['authenticate'],
})
class requestSeller extends Vue {
  name: string = ''
  gender: string = ''
  dob: any = null
  phone: string = ''
  email: string = ''
  cccd: string = ''
  city: string = ''
  district: string = ''
  street: string = ''
  houseNumber: string = ''
  filePortrait: any = null
  fileCitizenId: any = null
  bankAccountNum: string = ''
  bankCode: string = ''
  bankName: string = ''
  content: string = ''

  //private
  portraitUrl: string = ''
  citizenIdUrl: string = ''
  disableButton: boolean = false
  //
  fieldLabels: Record<string, string> = {
    name: 'Tên người dùng',
    gender: 'Giới tính',
    dob: 'Ngày sinh',
    phone: 'Số điện thoại',
    email: 'Email',
    cccd: 'Số CCCD',
    city: 'Thành phố',
    district: 'Quận, huyện',
    street: 'Phường, xã',
    houseNumber: 'Địa chỉ',
    filePortrait: 'Ảnh chân dung',
    fileCitizenId: 'Ảnh thẻ cccd/cmnd mặt trước',
    content: 'Ghi rõ chủng loại sản phẩm bạn định bán',
  }
  requiredFields: string[] = [
    'name',
    'gender',
    'dob',
    'phone',
    'email',
    'cccd',
    'city',
    'district',
    'street',
    'content',
    'houseNumber',
    'filePortrait',
    'fileCitizenId',
  ]
  errors: Record<string, boolean> = {}

  //option data
  oGenders = GENDER_OPTION
  selectedCity: Option.Option | null = null
  selectedDistrict: Option.Option | null = null
  selectedStreet: Option.Option | null = null
  selectedBank: any | null = null
  option: Option.Option | undefined
  oCitys: Option.Option[] = []
  oDistricts: Option.Option[] = []
  oStreets: Option.Option[] = []
  oBanks: any[] = []

  @nsStoreSeller.Action
  actCreateSeller!: (params: any) => Promise<any>
  @nsStoreSeller.Action
  actGetCategory!: (params: any) => Promise<any>
  @nsStoreUser.State('user')
  user!: User.Model | undefined
  @nsStoreAddress.Action
  actGetCity!: () => Promise<string>
  @nsStoreAddress.Action
  actGetDistrict!: (params: any) => Promise<string>
  @nsStoreAddress.Action
  actGetStreet!: (params: any) => Promise<string>
  @nsStoreBank.Action
  actGetBanksList!: () => Promise<string>
  async mounted() {
    this.name = this.user?.name || ''
    this.gender = this.user?.gender || ''
    this.dob = this.user?.doB || ''
    this.phone = this.user?.phone || ''
    this.email = this.user?.email || ''
    this.cccd = this.user?.citizenId || ''
    this.city = this.user?.city || ''
    this.district = this.user?.district || ''
    this.street = this.user?.street || ''
    this.houseNumber = this.user?.houseNumber || ''
    await this.GetCity();
    await this.getDistrict();
    await this.getStreet();
    await this.GetBank();
  }
  async onSubmit() {
    this.disableButton = true
    //const response = await this.actGetCategory(null)
    //console.log(response)
    if (!this.checkValid()) {
      this.disableButton = false
      return
    }
    const formData = new FormData();
    formData.append('CitizenId', this.cccd);
    formData.append('Email', this.email);
    formData.append('City', this.city);
    formData.append('District', this.district);
    formData.append('Street', this.street);
    formData.append('HouseNumber', this.houseNumber);
    formData.append('gender', this.gender);
    formData.append('BankAccountNum', this.bankAccountNum);
    formData.append('BankCode', this.bankCode);
    formData.append('BankName', this.bankName);
    formData.append('DoB', new Date(this.dob).toISOString());
    formData.append('Content', this.content);
    formData.append('Address', this.houseNumber + ', ' + this.selectedStreet?.name + ', ' + this.selectedDistrict?.name + ', ' + this.selectedCity?.name);
    formData.append('RawPortrait', this.filePortrait, this.filePortrait.name);
    formData.append('RawCitizenIdImage', this.fileCitizenId, this.fileCitizenId.name);
    console.log(formData)
    console.log(this.fileCitizenId.name)
    const response = await this.actCreateSeller(formData)
    if (response) {
      this.$toast.add({ severity: 'info', summary: 'Success', detail: 'Đã gửi yêu cầu cho VAUX', life: 10000 })
      this.$router.push('/account/profile')
    }
    this.disableButton = false
  }
  onUploadFile(event: Event, imgFor: string) {
    const inputElement = event.target as HTMLInputElement
    const files = inputElement.files
    if (files && files.length > 0) {
      if (files[0].size / 1024 / 1024 > 3) {
        this.$store.commit(
          'commons/store-error/setError',
          'File tải lên quá lớn'
        )
        return
      }
      if (imgFor === 'Portrait') {
        this.filePortrait = files[0]
        this.portraitUrl = URL.createObjectURL(this.filePortrait)
      } else if (imgFor === 'CitizenId') {
        this.fileCitizenId = files[0]
        this.citizenIdUrl = URL.createObjectURL(this.fileCitizenId)
      }
    }
  }
  async GetCity() {
    const response: any = await this.actGetCity()
    this.oCitys = response.map((city: any) => ({
      id: city.code,
      name: city.name,
      value: city.codename,
    }));
    this.selectedCity = this.oCitys.find((city) => city.value === this.city) || null;
  }
  async getDistrict() {
    if (this.selectedCity == undefined || this.selectedCity == null) return
    this.city = this.selectedCity.value
    const response: any = await this.actGetDistrict({ cityId: this.selectedCity?.id })
    this.oDistricts = response.districts.map((district: any) => ({
      id: district.code,
      name: district.name,
      value: district.codename,
    }));
    this.selectedDistrict = this.oDistricts.find((district) => district.value === this.district) || null;
  }
  async getStreet() {
    if (this.selectedDistrict == undefined || this.selectedDistrict == null) return
    this.district = this.selectedDistrict.value
    const response: any = await this.actGetStreet({ districtId: this.selectedDistrict?.id })
    this.oStreets = response.wards.map((street: any) => ({
      id: street.code,
      name: street.name,
      value: street.codename,
    }));
    this.selectedStreet = this.oStreets.find((street) => street.value === this.street) || null;
  }
  onSelectCity() {
    this.district = ''
    this.street = ''
    this.oStreets = []
    this.getDistrict()
  }
  async GetBank() {
    const response: any = await this.actGetBanksList()
    console.log(response)
    if (response.code == '00') {

    }
    this.oBanks = response.data.map((bank: any) => ({
      id: bank.id,
      name: bank.shortName + ' - ' + bank.name,
      fullname: bank.name,
      value: bank.code,
    }));
    // this.selectedCity = this.oCitys.find((city) => city.value === this.city) || null;
  }
  onSelectBank() {
    this.bankName = this.selectedBank?.fullname
    this.bankCode = this.selectedBank?.value
  }
  checkValid() {
    const invalidFields: string[] = this.validateFields(this.requiredFields)

    if (invalidFields.length > 0) {
      const errorFields = invalidFields
        .map((field) => this.fieldLabels[field])
        .join(', ')
      const errorMessage = `Vui lòng điền thêm thông tin: ${errorFields}`
      this.$store.commit('commons/store-error/setError', errorMessage)
      return false
    }
    return true
  }
  validateFields(fields: string[]): string[] {
    const invalidFields: string[] = []
    this.errors = {}
    fields.forEach((field) => {
      console.log((this as any)[field])
      this.errors[field] = !(this as any)[field]
      if (!(this as any)[field]) {
        invalidFields.push(field)
      }
    })

    return invalidFields
  }
  isRequiredField(field: string): boolean {
    return this.requiredFields.includes(field)
  }
}
export default requestSeller
</script>
  
<style lang="sass" scoped>
.card-control
  display: block
  background: $white
  font-weight: 1
  font-size: 0.875rem
  line-height: 1
  color: #69707a
  background-clip: padding-box
  border: 1px solid #c5ccd6
  appearance: none
  border-radius: 0.35rem
.card-header
  padding: 1.2rem 1.35rem
  margin-bottom: 0
  background-color: rgba(33, 40, 50, 0.03)
  border-bottom: 1px solid rgba(33, 40, 50, 0.125)
.rounded-circle
  border-radius: 50% !important
</style>
                