import React, { useEffect } from 'react'

import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined'
import TextBoxToolTip from '~/components/Common/TextBoxToolTip'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CardTemplateCreateFieldReq } from '~/core/services/board-services.model'
import Typography from '@mui/material/Typography'
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined'

import ListIcon from '@mui/icons-material/List'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { ButtonBase } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Textarea from '@mui/joy/Textarea'
import { useCreateFieldMutation, useDeleteFieldMutation, useLazyGetFieldsQuery, useUpdateFieldMutation } from '~/core/redux/api/board-template.api'
import { ApiResponse } from '~/core/services/api.model'
import { isBlank } from '~/core/utils/data-utils'
import { toast } from 'react-toastify'
import { set } from 'lodash'

export interface CustomFieldPopoverProps {
    id: string
    templateItem: any
    open: boolean
    anchorEl: HTMLElement
    onClose?: () => void
}

export interface MemberItemmProps {
    item: any
}

export interface OptionsItemProps {
    id: number
    item: OptionItem
}

export interface ColorSelectOptionProps {
    id: number
    data: string
    selectedId: number
}

export interface ColorPickerProps {
    id: number
    open: boolean
    anchorEl: HTMLElement
    onClose: () => void
    onColorSelect: (color: string) => void
    defaultSelectedColor?: string
}

export interface ColorOptionsListType {
    [key: number]: { color: string };
}

export interface OptionItem {
    id: number
    title: string
    color: string
}

const titleSx = {
    frontSize: '20px',
    fontWeight: '500',
    maxWidth: '150px'
}

const borderBottom = {
    borderBottom: '1px solid #DCDFE4'
}

const checkBoxSx = {
    p: '6px 4px',
    m: '0 2px'
}

const CustomFieldPopoverFC: React.FC<CustomFieldPopoverProps> = ({ id, templateItem, open, anchorEl, onClose }) => {
    // const { data: apiResponse, isLoading, refetch } = useGetFieldsQuery(templateItem?.id)
    const [getField, { isLoading: getLoading }] = useLazyGetFieldsQuery()
    const [createField, { isLoading: createLoading }] = useCreateFieldMutation()
    const [updateField, { isLoading: updateLoading }] = useUpdateFieldMutation()
    const [deleteField, { isLoading: deleteLoading }] = useDeleteFieldMutation()

    const isLoading = getLoading || createLoading || updateLoading || deleteLoading

    const [data, setData] = React.useState<any[]>([])

    const fetchData = async () => {
        const response = await getField(templateItem?.id).unwrap() as ApiResponse<any>
        const newData = response.data.map((item: any) => {
            if (item.type === 'DROPDOWN') {
                return {
                    ...item,
                    options: item?.options.map((option: any, index: any) => ({
                        ...option,
                        id: index
                    }))
                }
            } else {
                return item
            }
        })
        setData(newData)
    }

    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open])

    const [optionsItemList, setOptionsItemList] = React.useState<OptionItem[]>([])
    const [currentMenu, setCurrentMenu] = React.useState('setting') // setting, create-new, edit
    const [actionsShow, setActionsShow] = React.useState('edit')

    useEffect(() => {
        setOptionsItemList([])
        setSelectedType('TEXT')
        reset()
    }, [open, currentMenu])

    const [selectedField, setSelectedField] = React.useState(null)

    useEffect(() => {
        setOptionsItemList(selectedField?.options?.map((option: any) => ({ ...option })) || [])
        setSelectedType(selectedField?.type || 'TEXT')
        setValue('id', selectedField?.id)
        setValue('title', selectedField?.title)
        setValue('type', selectedField?.type)
        setValue('option', selectedField?.option)
    }, [selectedField])

    const MainContent: React.FC = () => {
        const [fillterName, setFillterName] = React.useState(null)

        const LabelItem: React.FC<MemberItemmProps> = ({ item }) => {
            return (
                <Box sx={{ p: '2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        {/* <Checkbox
                            sx={checkBoxSx}
                        /> */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#F7F8F9',
                            borderRadius: '2px',
                            height: '34px',
                            paddingLeft: '8px',
                            width: '100%'
                        }}
                        >
                            {(() => {
                                switch (item.type) {
                                    case 'DROPDOWN':
                                        return <ListIcon sx={{ fontSize: '20px', color: '#5E6C84' }} />
                                    case 'TEXT':
                                        return <TextFieldsIcon sx={{ fontSize: '20px', color: '#5E6C84' }} />
                                    case 'DATE':
                                        return <CalendarMonthIcon sx={{ fontSize: '20px', color: '#5E6C84' }} />
                                    case 'CHECKBOX':
                                        return <CheckCircleOutlineIcon sx={{ fontSize: '20px', color: '#5E6C84' }} />
                                    default:
                                        return null
                                }
                            })()}
                            <TextBoxToolTip sx={{
                                ...titleSx,
                                ml: '8px'
                            }} id='1asd' text={item.title} breakOnLine={1} />
                        </Box>
                    </Box>
                    <Box>
                        <Checkbox
                            sx={{
                                ...checkBoxSx,
                                cursor: templateItem.usedIn === 0 ? 'pointer' : 'unset'
                            }}
                            icon={
                                templateItem.usedIn === 0
                                    ?
                                    actionsShow === 'edit'
                                        ? <ModeEditOutlinedIcon />
                                        : <DeleteIcon />
                                    : <EditOffOutlinedIcon />
                            }
                            checkedIcon={
                                templateItem.usedIn === 0
                                    ?
                                    actionsShow === 'edit'
                                        ? <ModeEditOutlinedIcon />
                                        : <DeleteIcon />
                                    : <EditOffOutlinedIcon />
                            }
                            onClick={() =>
                                templateItem.usedIn === 0
                                    ? (async () => {
                                        switch (actionsShow) {
                                            case 'edit':
                                                setCurrentMenu('edit')
                                                break
                                            case 'delete':
                                                try {
                                                    await deleteField(
                                                        { id: item.id, templateId: templateItem?.id }
                                                    ).unwrap()
                                                    await fetchData()
                                                } catch (error) {
                                                    toast.error('Delete label failed', {
                                                        position: 'bottom-right'
                                                    })
                                                }
                                                break
                                            default:
                                                break
                                        }
                                        setSelectedField(item)
                                    })()
                                    : null
                            }
                        />
                    </Box>
                </Box>
            )
        }

        return (
            <Box sx={{
                m: '12px 24px',
                display: currentMenu === 'setting' ? 'block' : 'none'
            }}>
                <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>Field Settings</Box>
                <Box sx={{ ...borderBottom, p: '8px 0 4px 0', mb: '6px' }}>
                    <TextField
                        placeholder='Field name'
                        size='small'
                        sx={{ width: '100%' }}
                        onChange={(e) => setFillterName(e.target.value)}
                    />
                    <FormHelperText>Type name to search</FormHelperText>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>Fields</Box>
                    {templateItem.usedIn === 0 && (
                        <Box sx={{ display: 'flex' }}>
                            <Box
                                sx={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    color: actionsShow === 'edit' ? '#0079BF' : '#44546f',
                                    textDecoration: actionsShow === 'edit' ? 'underline' : 'none'
                                }}
                                onClick={() => setActionsShow('edit')}
                            >Edit</Box>
                            <Box
                                sx={{
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    ml: '12px',
                                    color: actionsShow === 'delete' ? '#0079BF' : '#44546f',
                                    textDecoration: actionsShow === 'delete' ? 'underline' : 'none'
                                }}
                                onClick={() => setActionsShow('delete')}
                            >Delete</Box>
                        </Box>
                    )}
                </Box>
                <Box sx={{
                    ...borderBottom,
                    pb: '8px',
                    mb: '6px',
                    maxHeight: '300px',
                    overflowY: 'scroll',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                        height: '6px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#dcdde1',
                        borderRadius: '8px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#A8A8A8'
                    }
                }}>
                    {(fillterName
                        ? data.filter((item: any) =>
                            item.title.toLowerCase().includes(fillterName.toLowerCase())
                        )
                        : data
                    )?.map((item: any) => {
                        return (
                            <Box key={item.id}>
                                <LabelItem item={item} />
                            </Box>
                        )
                    })}
                </Box>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '12px'
                }}>
                    {
                        templateItem?.usedIn === 0
                            ?
                            (
                                <Button
                                    id={`abc-${id}`}
                                    sx={{ width: '100%' }}
                                    className="button right-button"
                                    variant="contained"
                                    onClick={() => {
                                        setSelectedField(null)
                                        setOptionsItemList([])
                                        setSelectedType('TEXT')
                                        setCurrentMenu('create-new')
                                    }}
                                >Create a new field</Button>
                            )
                            : null
                    }
                </Box>
            </Box>
        )
    }

    const [selectedType, setSelectedType] = React.useState('TEXT')
    const { register, handleSubmit, formState: { errors }, setValue, setError, reset, clearErrors } = useForm<CardTemplateCreateFieldReq>({
        defaultValues: {
            id: null,
            title: null,
            type: 'TEXT',
            option: null,
            templateId: templateItem?.id
        }
    })
    const CreateNewContent: React.FC = () => {

        const onSubmit: SubmitHandler<CardTemplateCreateFieldReq> = async (data) => {
            if (selectedType === 'DROPDOWN') {
                if (optionsItemList.length === 0) {
                    setError('option', {
                        type: 'required',
                        message: 'Options is required'
                    })
                    return
                }
                data.option = optionsItemList
            }
            try {
                if (currentMenu === 'edit') {
                    await updateField(data)
                } else {
                    await createField(data)
                }
                await fetchData()
                toast.success('Template created successfully', {
                    position: 'bottom-right'
                })
                setCurrentMenu('setting')
            } catch (err) {
                console.log(err)
            }
            // console.log(data)
        }

        const [optionsName, setOptionsName] = React.useState(null)
        const [clickedAddOptions, setClickedAddOptions] = React.useState(false)

        useEffect(() => {
            if (clickedAddOptions && optionsName) {
                setOptionsItemList(
                    [...optionsItemList,
                        { id: optionsItemList.length, title: optionsName, color: null }
                    ]
                )
            }
        }, [clickedAddOptions, optionsName])

        const ColorPicker: React.FC<ColorPickerProps> = ({ id, open, anchorEl, onClose, onColorSelect, defaultSelectedColor }) => {
            const colors = [
                '#E2E4EA',
                '#4BCE97',
                '#F5CD47',
                '#FEA362',
                '#F87168',
                '#9F8FEF',
                '#579DFF',
                '#6CC3E0',
                '#94C748',
                '#E674BB',
                '#8590A2'
            ]

            const [selectedColor, setSelectedColor] = React.useState(defaultSelectedColor)

            return (
                <Popover
                    id={`color-picker-${id}`}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={onClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    slotProps={{
                        paper: {
                            style: {
                                width: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0'
                            }
                        }
                    }}
                    style={{ zIndex: 999 }}
                >
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 40px)',
                        gap: '8px',
                        width: '100%',
                        padding: '8px'
                    }}>
                        {colors.map((color, index) => {
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        width: '37px',
                                        height: '37px',
                                        borderRadius: '3px',
                                        background: color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            boxShadow: 'inset 0 0 0 1000px rgba(0, 0, 0, 0.4)'
                                        }
                                    }}
                                    onClick={() => {
                                        setSelectedColor(color)
                                        onColorSelect(color)
                                    }}
                                >
                                    {color === selectedColor ? <CheckOutlinedIcon /> : null}
                                </Box>
                            )
                        })}
                    </Box>
                </Popover >
            )
        }

        const OptionsItem: React.FC<OptionsItemProps> = ({ id, item }) => {
            const [anchorElMember, setAnchorElMember] = React.useState(null)
            const isOpen = Boolean(anchorElMember)

            const colors = [
                '#E2E4EA',
                '#4BCE97',
                '#F5CD47',
                '#FEA362',
                '#F87168',
                '#9F8FEF',
                '#579DFF',
                '#6CC3E0',
                '#94C748',
                '#E674BB',
                '#8590A2'
            ]

            if (!item.color) {
                if (id >= 0 && id <= 10) {
                    item.color = colors[id]
                } else if (id > 10) {
                    item.color = colors[(id - 11) % 11]
                }
            }

            const [itemTitle, setItemTitle] = React.useState(item.title)

            return (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: '8px'

                }}>
                    <Box
                        sx={{
                            display: 'flex'
                        }}
                    >
                        <ButtonBase
                            onClick={(e) => setAnchorElMember(e.currentTarget)}
                        >
                            <Box
                                sx={{
                                    width: '37px',
                                    height: '37px',
                                    borderRadius: '3px',
                                    display: 'flex',
                                    backgroundColor: item.color
                                }}
                            />
                        </ButtonBase>
                        <Textarea
                            sx={{ ml: '8px' }}
                            name="Plain"
                            variant="plain"
                            value={itemTitle}
                            onChange={(e) => {
                                if (!e.target.value) return
                                const value = e.target.value
                                if (!value.includes('-') && !value.includes(',')) {
                                    setItemTitle(value)
                                }
                            }}
                            onBlur={() => {
                                setOptionsItemList(
                                    optionsItemList.map((option) => {
                                        if (option.id === id) {
                                            option.title = itemTitle
                                        }
                                        return option
                                    })
                                )
                            }}
                        />
                    </Box>
                    <IconButton
                        aria-label="delete"
                        onClick={() => {
                            setOptionsItemList(
                                optionsItemList.filter((option) => option.id !== id)
                            )
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <ColorPicker
                        id={id}
                        open={isOpen}
                        anchorEl={anchorElMember}
                        onClose={() => setAnchorElMember(null)}
                        onColorSelect={(color) => {
                            setOptionsItemList(
                                optionsItemList.map((option) => {
                                    if (option.id === id) {
                                        option.color = color
                                    }
                                    return option
                                })
                            )
                        }}
                        defaultSelectedColor={item.color}
                    />
                </Box>
            )
        }

        return (
            <Box sx={{
                m: '12px 24px',
                display: currentMenu === 'setting' ? 'none' : 'block'
            }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <Checkbox
                            sx={{
                                ...checkBoxSx,
                                position: 'absolute',
                                top: '8px',
                                left: '16px'
                            }}
                            icon={<ArrowBackIosOutlinedIcon sx={{ fontSize: '16px' }} />}
                            checkedIcon={<ArrowBackIosOutlinedIcon sx={{ fontSize: '16px' }} />}
                            onClick={() => {
                                setSelectedField(null)
                                setCurrentMenu('setting')
                            }}
                        />
                        <Box sx={{ justifyContent: 'center', width: '100%', display: 'flex', fontWeight: '500', color: '#44546f' }}>
                            {
                                currentMenu === 'edit' ? 'Edit Field' : 'Create a new Field'
                            }
                        </Box>
                    </Box>
                    <Box sx={{ p: '8px 0 4px 0', mb: '6px' }}>
                        <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>
                            Title
                            <Typography variant="caption" color="error">
                                &nbsp;&nbsp;&nbsp;{errors?.title?.message}
                            </Typography>
                        </Box>
                        <TextField
                            placeholder=''
                            size='small'
                            sx={{ width: '100%' }}
                            {...register('title', {
                                required: 'Field is required'
                            })}
                            error={!!errors.title}
                        />
                    </Box>

                    <Box sx={{ p: '0 0 4px 0', mb: '6px' }}>
                        <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>
                            Type
                            <Typography variant="caption" color="error">
                                &nbsp;&nbsp;&nbsp;{errors?.type?.message}
                            </Typography>
                        </Box>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                sx={{ height: '37px' }}
                                onChange={(e) => {
                                    setSelectedType(e.target.value)
                                    setValue('type', e.target.value)
                                }}
                                value={selectedType === null ? 'TEXT' : selectedType}
                            >
                                <MenuItem value={'DROPDOWN'}>
                                    Dropdown
                                </MenuItem>
                                <MenuItem value={'TEXT'}>
                                    Text
                                </MenuItem>
                                <MenuItem value={'DATE'}>
                                    Date
                                </MenuItem>
                                <MenuItem value={'CHECKBOX'}>
                                    Checkbox
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {selectedType === 'DROPDOWN' && (
                        <Box sx={{ p: '8px 0 4px 0', mb: '6px' }}>
                            <Box sx={{ fontSize: '12px', fontWeight: '500', color: '#44546f' }}>
                                Options
                                <Typography variant="caption" color="error">
                                    &nbsp;&nbsp;&nbsp;{errors?.option?.message}
                                </Typography>
                            </Box>
                            {optionsItemList.map((item, index) => {
                                return (
                                    <OptionsItem key={index} id={index} item={item} />
                                )
                            })}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <TextField
                                    placeholder='Add item ...'
                                    size='small'
                                    sx={{ width: '73%' }}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (!value.includes('-') && !value.includes(',')) {
                                            setOptionsName(value)
                                        }
                                    }}
                                    error={clickedAddOptions && !optionsName}
                                />
                                <Button
                                    className="button right-button"
                                    sx={{
                                        width: '15%',
                                        backgroundColor: '#0079BF',
                                        height: '37px !important'
                                    }}
                                    variant="contained"
                                    onClick={() => {
                                        setClickedAddOptions(true)
                                        if (isBlank(optionsName)) return
                                        clearErrors('option')
                                        setOptionsItemList(
                                            [...optionsItemList,
                                                { id: optionsItemList.length, title: optionsName, color: null }
                                            ]
                                        )
                                    }}
                                >Add</Button>
                            </Box>
                        </Box>
                    )}

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        marginTop: '12px'
                    }}>
                        <Button
                            type='submit'
                            id={`submit-create-field-${id}`}
                            sx={{
                                width: '100%',
                                backgroundColor: '#0079BF'
                            }}
                            variant="contained"
                        >
                            {
                                currentMenu === 'edit' ? 'Edit Field' : 'Create a new Field'
                            }
                        </Button>
                    </Box>
                </form>
            </Box>
        )
    }

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            slotProps={{
                paper: {
                    style: {
                        width: '320px',
                        borderRadius: '8px',
                        // border: '1px solid #B2B9C4',
                        boxShadow: '0',
                        marginTop: id === 'header-create-board-popover' ? '8px' : '0'
                    }
                }
            }}
            style={{ zIndex: 999 }}
        >
            <MainContent />
            <CreateNewContent />
        </Popover >
    )
}

export default CustomFieldPopoverFC