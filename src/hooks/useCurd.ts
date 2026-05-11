import { useLocalStorage, useToggle } from '@vueuse/core'

interface IUseCurdOptions<T> {
  key: string
  initData: Partial<T>[]
}

const LIMIT_SIZE = 10

export function useCurd<T extends object>(options: IUseCurdOptions<T>) {
  const dataList = useLocalStorage(options.key, options.initData)
  const page = ref(1)

  const pageOfDataList = computed(() => {
    const start = (page.value - 1) * LIMIT_SIZE
    const end = start + LIMIT_SIZE
    return dataList.value.slice(start, end)
  })

  const pagesAll = computed(() => {
    return Math.ceil(dataList.value.length / LIMIT_SIZE)
  })

  function onUpdatePage(changePage: number) {
    page.value = changePage
  }

  function addData(item?: Partial<T>) {
    if (item) {
      dataList.value.push(item)
    }
  }

  function removeData(index: number) {
    if (index < 0 || index >= dataList.value.length)
      return

    dataList.value.splice(index, 1)
  }

  const changeModal = ref<Partial<T>>({})
  const isUpdate = ref(false)
  const updateDataIndex = ref(-1)
  const [openModalState, changeModelState] = useToggle()
  const updateTitle = computed(() => {
    return isUpdate.value ? '修改' : '新增'
  })

  function openModal(data?: T, updateIndex?: number) {
    isUpdate.value = !!data
    updateDataIndex.value = typeof updateIndex === 'number' ? updateIndex : -1
    changeModelState(true)
    changeModal.value = data ? JSON.parse(JSON.stringify(data)) : {}
  }

  function saveForm() {
    if (isUpdate.value) {
      if (updateDataIndex.value >= 0) {
        updateData(updateDataIndex.value, changeModal.value)
      }
    }
    else {
      addData(changeModal.value)
    }
    closeModal()
  }

  function closeModal() {
    changeModelState(false)
    changeModal.value = {}
  }

  function updateData(index: number, item: Partial<T>) {
    if (index < 0)
      return
    dataList.value[index] = item
  }

  return {
    dataList,
    page,
    pagesAll,
    pageOfDataList,
    isUpdate,
    // modal
    openModalState,
    changeModal,
    updateTitle,
    closeModal,
    openModal,
    saveForm,
    updateDataIndex,
    // curd
    onUpdatePage,
    addData,
    removeData,
    updateData,
  }
}
