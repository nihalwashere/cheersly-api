const HypeDocsModel = require("../../mongo/models/HypeDocs");
const { validateToken } = require("../../utils/common");

const CreateHypeDocResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { title, category, when, content } = args;

    if (!title) {
      throw new Error("Title is required");
    }

    if (!category) {
      throw new Error("Category is required");
    }

    if (!when) {
      throw new Error("When is required");
    }

    if (!content) {
      throw new Error("Content is required");
    }

    await new HypeDocsModel({
      userId: token.slackUserId,
      title,
      category,
      when,
      content
    }).save();

    return {
      success: true
    };
  } catch (error) {
    throw new Error(error);
  }
};

const HypeDocsListResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { slackUserId: userId } = token;

    const { pageIndex, pageSize } = args;

    const totalCount = await HypeDocsModel.find({
      userId
    }).countDocuments({});

    const data = await HypeDocsModel.find({
      userId
    })
      .sort({ created_at: 1 })
      .skip(pageSize * pageIndex)
      .limit(pageSize);

    return {
      data,
      totalCount: Number(totalCount),
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    throw new Error(error);
  }
};

const UpdateHypeDocResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { id, title, category, when, content } = args;

    if (!id) {
      throw new Error("Id is required");
    }

    await HypeDocsModel.updateOne(
      { _id: id },
      { title, category, when, content }
    );

    return {
      success: true
    };
  } catch (error) {
    throw new Error(error);
  }
};

const DeleteHypeDocResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { id } = args;

    if (!id) {
      throw new Error("Id is required");
    }

    await HypeDocsModel.deleteOne({ _id: id });

    return {
      success: true
    };
  } catch (error) {
    throw new Error(error);
  }
};

const HypeDocDetailsResolver = async (_, args, context) => {
  try {
    const token = await validateToken(context.headers);

    if (token.status !== 200) {
      throw new Error(token.message);
    }

    const { id } = args;

    if (!id) {
      throw new Error("Id is required");
    }

    const hypeDoc = await HypeDocsModel.findOne({ _id: id });

    if (!hypeDoc) {
      throw new Error("Hype doc not found");
    }

    return {
      data: hypeDoc
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  CreateHypeDocResolver,
  HypeDocsListResolver,
  UpdateHypeDocResolver,
  DeleteHypeDocResolver,
  HypeDocDetailsResolver
};
