import { BorrowModel } from "../models";

class BorrowRepository {
  async getAll(criteria?: any, relations?: string[]) {
    const query = BorrowModel.find({ ...criteria });
    if (relations) {
      query.populate(relations.toString());
    }
    return query.exec();
  }

  async getOne(id: string) {
    return BorrowModel.findById(id).populate("book").exec();
  }

  async create(borrow: any) {
    return BorrowModel.create(borrow);
  }

  async delete(id: string, now: number) {
    return BorrowModel.findByIdAndUpdate(id, {
      stock: 0,
      deletedAt: now,
    }).exec();
  }
}
export const borrowRepository = new BorrowRepository();
