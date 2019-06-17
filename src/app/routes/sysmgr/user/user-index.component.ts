import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { tap, map } from 'rxjs/operators';
import { STComponent, STColumn, STData, STChange } from '@delon/abc';
import { UserFormComponent } from './user-form.component';

@Component({
  selector: 'dcp-user-index',
  templateUrl: './user-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserIndexComponent implements OnInit {
  q: any = {
    pi: 1,
    ps: 10,
    sorter: '',
    status: null,
    statusList: [],
  };
  data: any[] = [];
  loading = false;
  status = [
    { index: 0, text: '关闭', value: false, type: 'default', checked: false },
    {
      index: 1,
      text: '运行中',
      value: false,
      type: 'processing',
      checked: false,
    },
    { index: 2, text: '已上线', value: false, type: 'success', checked: false },
    { index: 3, text: '异常', value: false, type: 'error', checked: false },
  ];
  @ViewChild('st')
  st: STComponent;
  columns: STColumn[] = [
    { title: '', index: 'key', type: 'checkbox' },
    { title: '用户编号', index: 'no' },
    { title: '用户名称', index: 'description' },
    {
      title: '手机号',
      index: 'callNo',
      type: 'number',
      format: (item: any) => `${item.callNo} 万`,
      sorter: (a: any, b: any) => a.callNo - b.callNo,
    },
    { title: '性别', index: 'description' },
    {
      title: '创建时间',
      index: 'updatedAt',
      type: 'date',
      sort: {
        compare: (a: any, b: any) => a.updatedAt - b.updatedAt,
      },
    },
    {
      title: '操作',
      buttons: [
        {
          text: '编辑',
          click: (item: any) => this.msg.success(`编辑${item.no}`),
        },
        {
          text: '更多',
          click: (item: any) => this.msg.success(`订阅警报${item.no}`),
        },
      ],
    },
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private modal: ModalHelper,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.q.statusList = this.status.filter(w => w.checked).map(item => item.index);
    if (this.q.status !== null && this.q.status > -1) {
      this.q.statusList.push(this.q.status);
    }
    this.http
      .get('/rule', this.q)
      .pipe(
        map((list: any[]) =>
          list.map(i => {
            const statusItem = this.status[i.status];
            i.statusText = statusItem.text;
            i.statusType = statusItem.type;
            return i;
          }),
        ),
        tap(() => (this.loading = false)),
      )
      .subscribe(res => {
        this.data = res;
        this.cdr.detectChanges();
      });
  }

  stChange(e: STChange) {
    // switch (e.type) {
    //   case 'checkbox':
    //     this.selectedRows = e.checkbox!;
    //     this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv.callNo, 0);
    //     this.cdr.detectChanges();
    //     break;
    //   case 'filter':
    //     this.getData();
    //     break;
    // }
  }

  remove() {
    this.http.delete('/rule', { nos: this.selectedRows.map(i => i.no).join(',') }).subscribe(() => {
      this.getData();
      this.st.clearCheck();
    });
  }

  approval() {
    this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  }

  // add(tpl: TemplateRef<{}>) {
  //   this.modalSrv.create({
  //     nzTitle: '新建规则',
  //     nzContent: tpl,
  //     nzOnOk: () => {
  //       this.loading = true;
  //       this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
  //     },
  //   });
  // }

  navForm(record: any = {}) {
    this.modal.create(UserFormComponent, { record }, { size: 'md' }).subscribe(res => {
      if (record.id) {
        record = { ...record, id: 'mock_id', percent: 0, ...res };
      } else {
        this.data.splice(0, 0, res);
        this.data = [...this.data];
      }
      this.cdr.detectChanges();
    });
  }

  reset() {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }
}
