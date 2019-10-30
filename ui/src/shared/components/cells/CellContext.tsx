// Libraries
import React, {PureComponent} from 'react'
import {get} from 'lodash'

// Components
import {Context} from 'src/clockface'
import {ErrorHandling} from 'src/shared/decorators/errors'

// Types
import {IconFont, ComponentColor} from '@influxdata/clockface'
import {Cell, View} from 'src/types'

interface Props {
  cell: Cell
  view: View
  onDeleteCell: (cell: Cell) => void
  onCloneCell: (cell: Cell) => void
  onCSVDownload: () => void
  onEditCell: () => void
  onEditNote: (id: string) => void
}

@ErrorHandling
export default class CellContext extends PureComponent<Props> {
  public render() {
    const {cell, onDeleteCell, onCloneCell} = this.props

    return (
      <Context className="cell--context">
        <Context.Menu testID="cell-context-menu--edit" icon={IconFont.Pencil}>
          {this.editMenuItems}
        </Context.Menu>
        <Context.Menu
          icon={IconFont.Duplicate}
          color={ComponentColor.Secondary}
          testID="cell-context-menu--clone"
        >
          <Context.Item label="Clone" action={onCloneCell} value={cell} />
        </Context.Menu>
        <Context.Menu
          icon={IconFont.Trash}
          color={ComponentColor.Danger}
          testID="cell-context-menu--delete"
        >
          <Context.Item label="Delete" action={onDeleteCell} value={cell} />
        </Context.Menu>
      </Context>
    )
  }

  private get editMenuItems(): JSX.Element[] | JSX.Element {
    const {view, onEditCell, onCSVDownload} = this.props

    if (view.properties.type === 'markdown') {
      return <Context.Item label="Edit Note" action={this.handleEditNote} />
    }

    const hasNote = !!get(view, 'properties.note')

    return [
      <Context.Item
        key="configure"
        label="Configure"
        action={onEditCell}
        testID="cell-context-menu-item--configure"
      />,
      <Context.Item
        key="note"
        label={hasNote ? 'Edit Note' : 'Add Note'}
        action={this.handleEditNote}
        testID="cell-context-menu-item--note"
      />,
      <Context.Item
        key="download"
        label="Download CSV"
        action={onCSVDownload}
        disabled={true}
        testID="cell-context-menu-item--dl"
      />,
    ]
  }

  private handleEditNote = () => {
    const {
      view: {id},
      onEditNote,
    } = this.props

    onEditNote(id)
  }
}