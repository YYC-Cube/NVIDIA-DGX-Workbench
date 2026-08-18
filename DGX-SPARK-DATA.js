/* ═══════════════════════════════════════════════════════════════
   DGX-SPARK-DATA.js
   数据来源：
   1) AI-资源矩阵-统一知识图谱.md  (900+ 资源 · 8 大领域)
   2) NVIDIA-NIM-全量模型-分析报告.md (138 款模型 · 10 大类别)
   结构：GUIDES（操作指南，含步骤） + SKILLS（NVIDIA Skills）+ COMMANDS（命令库）
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   GUIDES — 操作指南数据
   字段说明：
   - id:        唯一标识
   - order:     序号（用于侧边栏显示）
   - title:     中文标题
   - titleEn:   英文/副标题
   - desc:      简短描述（卡片展示）
   - icon:      emoji 图标
   - cat:       分类 key（对应 getCategoryLabels）
   - diff:      'easy' | 'medium' | 'hard'
   - time:      预计时长
   - overview:  [[label, value], ...] 概览元信息
   - prereq:    [前置条件, ...]
   - steps:     [{ n, title, content, code:[[title,code],...], warning, tip }]
   - type:      'external' + externalUrl（外部链接型）
   ═══════════════════════════════════════════════════════════════ */
var GUIDES = [

  /* ═══════════════════════════════════════════════════════════════
     第一部分：AI 资源矩阵 — 统一知识图谱 (8 大领域)
     ═══════════════════════════════════════════════════════════════ */

  /* ── 1.1 矩阵总览 ── */
  {
    id: 'kg-overview',
    order: 1,
    title: 'AI 资源矩阵 · 统一知识图谱',
    titleEn: 'Unified Knowledge Graph Overview',
    desc: '900+ 资源 · 8 大领域 · 40+ 子分类，6 份独立文档合并去重的统一归档总览。',
    icon: '🗺️',
    cat: 'nvidia-resources',
    diff: 'easy',
    time: '5 分钟阅读',
    overview: [
      ['📊 资源总数', '900+'],
      ['🗂️ 领域', '8 大'],
      ['🔖 子分类', '40+'],
      ['📅 版本', 'v1.0'],
    ],
    steps: [
      {
        n: 1,
        title: '资源分布矩阵',
        content: 'NVIDIA 官方技术栈 85 项 (9%) — 核心基础设施；NVIDIA GitHub 生态 40 项 (4%) — 开源代码库；NLP/AIGC/LLM 650+ 项 (67%) — 最大资源池；开发工具链 130+ 项 (14%)；DGX Spark 社区生态 42 项 (4%)；平台服务与基础设施 60+ 项 (6%)。合计去重后约 900+ 独立资源。',
        tip: '67% 资源集中在 NLP/AIGC/LLM 领域，是最大的资源池，可作为重点研究方向。',
      },
      {
        n: 2,
        title: '八大领域导航',
        content: '一、NVIDIA 官方技术栈（85 项）；二、NVIDIA GitHub 开源生态（40 项）；三、NLP/AIGC/LLM 资源库（650+ 项）；四、开发工具链（130+ 项）；五、DGX Spark 社区生态（42 项）；六、平台服务与基础设施（60+ 项）；附录：关联图谱、学习路径、元数据。',
      },
      {
        n: 3,
        title: '来源文档映射',
        content: 'NVIDIA-URL.md → 第一章；NVIDIA-官方资源库-URL.md → 第一章+第二章；NVIDIA-DGX-URL.md → 第一章社区+第五章；NLP-GitHub-URL.md → 第三章；GITHUB-URL.md → 第四/五/六章；DGX-URL.md → 第五章。',
      },
    ],
  },

  /* ── 1.2 NVIDIA 官方技术栈 ── */
  {
    id: 'kg-nvidia-official',
    order: 2,
    title: 'NVIDIA 官方技术栈',
    titleEn: 'NVIDIA Official Tech Stack',
    desc: '85 项资源 · 云服务平台、核心 SDK、NeMo Agent 生态、GitHub 精选、社区论坛。',
    icon: '🟢',
    cat: 'nvidia-resources',
    diff: 'medium',
    time: '15 分钟',
    overview: [['📊 资源', '85 项'], ['🗂️ 子分类', '5 类']],
    steps: [
      {
        n: 1,
        title: '云服务平台与 AI 推理',
        content: 'Brev.dev GPU 云：一键部署预配置 GPU 开发环境；NVIDIA NIM APIs：LLM/图像/语音/多模态 API 集成；NGC GPU 云平台：HPC/AI 容器快速部署、预训练模型；phi-4 多模态 (NIM)：Microsoft Phi-4 多模态指令推理。',
        code: [
          ['Brev.dev GPU 云', 'https://brev.nvidia.com/launchables/create'],
          ['NVIDIA NIM APIs', 'https://build.nvidia.com/settings/integrations'],
          ['NGC GPU 云平台', 'https://www.nvidia.cn/gpu-cloud/'],
        ],
      },
      {
        n: 2,
        title: '核心 SDK 与开发框架',
        content: 'Holoscan SDK（边缘 AI，延迟<10ms）；CUDA 并行计算（CUDA Toolkit + CUDA-X）；CUDA-QX 量子平台（量子-经典混合）；cuQuantum SDK（量子电路仿真 10-100x）；Isaac ROS（机器人 AI 感知/运动规划/Sim2Real）；CUDA-Q 求解器 API（Python 量子求解器）。',
        tip: 'Holoscan SDK 面向边缘 AI，可实现低于 10ms 的传感器处理与流式 AI 推理。',
      },
      {
        n: 3,
        title: 'NeMo Agent 生态',
        content: 'NeMo AutoModel：自动模型选择/微调流水线/HPO；NemoClaw：Agent 运行时，OpenShell 容器+安全层+推理路由；OpenShell：标准化 Agent 执行环境，Docker/K8s 集成；NVIDIA AI Workbench：统一 IDE+项目模板+团队协作。',
        code: [
          ['NeMo AutoModel 文档', 'https://docs.nvidia.com/nemo/automodel/nightly/about/index.html'],
          ['NemoClaw', 'https://github.com/NVIDIA/NemoClaw'],
          ['NVIDIA AI Workbench', 'https://docs.nvidia.com/ai-workbench/user-guide/latest/overview/introduction.html'],
        ],
      },
      {
        n: 4,
        title: 'GitHub 精选开源项目',
        content: 'CCCL（CUDA C++ Core Libraries）；cuda-python（CUDA Python 绑定）；cuda-quantum（量子-经典混合）；DALI（GPU 加速数据加载）；cuopt（GPU 加速路径优化 LP/QP/VRP/MILP）；TensorRT-LLM（LLM 高性能推理引擎）；Automodel（Day-0 HuggingFace 自动微调）；RL（可扩展后训练强化学习）。',
        code: [
          ['CCCL', 'https://github.com/NVIDIA/cccl'],
          ['TensorRT-LLM', 'https://github.com/NVIDIA/TensorRT-LLM.git'],
          ['GenerativeAIExamples', 'https://github.com/NVIDIA/GenerativeAIExamples.git'],
        ],
      },
      {
        n: 5,
        title: '学习与社区论坛',
        content: 'NVIDIA 开发者论坛；DGX Spark / GB10 论坛；NeMo Agent Toolkit 论坛；NVIDIA NIM 论坛；NVIDIA NeMo 论坛；cuOpt 论坛；Holoscan SDK 论坛；TensorRT for RTX 论坛；NVIDIA 蓝图论坛。',
        code: [
          ['开发者论坛', 'https://forums.developer.nvidia.cn/'],
          ['DGX Spark / GB10 论坛', 'https://forums.developer.nvidia.cn/c/accelerated-computing/dgx-spark-gb10/120'],
          ['NeMo Agent Toolkit 论坛', 'https://forums.developer.nvidia.com/c/ai-data-science/nemo-agent-toolkit/709'],
        ],
      },
    ],
  },

  /* ── 1.3 NVIDIA GitHub 开源生态 ── */
  {
    id: 'kg-nvidia-github',
    order: 3,
    title: 'NVIDIA GitHub 开源生态',
    titleEn: 'NVIDIA GitHub Ecosystem',
    desc: '40 个官方 GitHub 项目，覆盖训练、推理、数据、安全、容器、数学、云平台 9 大领域。',
    icon: '🐙',
    cat: 'nvidia-resources',
    diff: 'medium',
    time: '12 分钟',
    overview: [['📊 项目', '40 个'], ['🗂️ 领域', '9 类']],
    steps: [
      {
        n: 1,
        title: '大模型训练与微调（6 个）',
        content: 'Megatron-LM：大规模 Transformer 分布式训练框架；Megatron-Core：核心并行计算原语库；NeMo：对话式 AI/ASR/TTS/NLP 全栈工具包；NeMo Automodel：Day-0 HuggingFace 自动微调；NeMo RL：后训练强化学习 GRPO/DPO/PPO；apex：PyTorch 混合精度与分布式训练加速。',
        code: [
          ['Megatron-LM', 'https://github.com/NVIDIA/Megatron-LM'],
          ['NeMo', 'https://github.com/NVIDIA/NeMo'],
          ['apex', 'https://github.com/NVIDIA/apex'],
        ],
      },
      {
        n: 2,
        title: '推理加速与部署（5 个）',
        content: 'TensorRT-LLM：LLM 高性能推理引擎；TensorRT：深度学习推理优化器/运行时；TransformerEngine：FP8 训练/推理加速库；Model-Optimizer：模型量化/剪枝/蒸馏 (ModelOpt)；Triton Inference Server：多框架推理服务。',
        code: [
          ['TensorRT-LLM', 'https://github.com/NVIDIA/TensorRT-LLM'],
          ['Triton Inference Server', 'https://github.com/triton-inference-server/server'],
        ],
      },
      {
        n: 3,
        title: '数据处理与科学计算（4 个）',
        content: 'cuDF/cuML (RAPIDS)：GPU 加速 DataFrame/ML，pandas/sklearn 替代；DALI：GPU 加速数据加载与预处理；cuOpt：GPU 加速组合优化引擎；cuVS：GPU 加速向量搜索与聚类。',
        code: [
          ['cuDF/cuML (RAPIDS)', 'https://github.com/rapidsai/cudf'],
          ['cuOpt', 'https://github.com/NVIDIA/cuopt'],
          ['cuVS', 'https://github.com/rapidsai/cuvs'],
        ],
      },
      {
        n: 4,
        title: '机器人与物理仿真（4 个）',
        content: 'Isaac Lab：GPU 加速机器人学习环境；Isaac Sim：机器人仿真平台；PhysicsNeMo：物理信息神经网络框架；Cosmos：世界基础模型 (WFM) 框架。',
        code: [
          ['Isaac Lab', 'https://github.com/NVIDIA-Omniverse/IsaacLab'],
          ['Isaac Sim', 'https://github.com/NVIDIA-Omniverse/IsaacSim'],
          ['Cosmos', 'https://github.com/NVIDIA/cosmos-framework'],
        ],
      },
      {
        n: 5,
        title: '安全与合规（3 个）',
        content: 'garak：LLM 漏洞扫描器（幻觉/越狱/数据泄露）；OpenShell：AI Agent 安全沙箱运行时；NeMo Guardrails：LLM 对话安全护栏。',
        warning: 'garak 用于红队测试，生产环境务必配合 NeMo Guardrails 形成纵深防御。',
        code: [
          ['garak', 'https://github.com/NVIDIA/garak'],
          ['NeMo Guardrails', 'https://github.com/NVIDIA/NeMo-Guardrails'],
        ],
      },
      {
        n: 6,
        title: '容器与基础设施（4 个）',
        content: 'nvidia-container-toolkit：GPU 容器运行时支持；GPU Operator：K8s GPU 驱动/运行时自动化管理；K8s NIM Operator：Kubernetes NIM 自动化部署；DCGM (GPU 监控)：GPU 指标 Prometheus 导出器。',
        code: [
          ['nvidia-container-toolkit', 'https://github.com/NVIDIA/nvidia-container-toolkit'],
          ['GPU Operator', 'https://github.com/NVIDIA/gpu-operator'],
        ],
      },
      {
        n: 7,
        title: '数学与并行计算（4 个）',
        content: 'CCCL：CUDA C++ Core Libraries；NCCL：多 GPU 通信原语（all-reduce/broadcast）；cuTENSOR：GPU 加速张量运算库；nvMath Python：cuBLAS/cuFFT/cuSparse Python 绑定。',
        code: [
          ['NCCL', 'https://github.com/NVIDIA/nccl'],
          ['cuTENSOR', 'https://github.com/NVIDIA/cutensor'],
        ],
      },
      {
        n: 8,
        title: '云平台与运维（3 个）',
        content: 'NVCF (Cloud Functions)：GPU Serverless 工作负载部署；AICR (AI Cluster Runtime)：GPU K8s 集群即用型配置；AIStore：AI 优化高性能分布式存储。',
        code: [
          ['AICR', 'https://github.com/NVIDIA/aicr'],
          ['AIStore', 'https://github.com/NVIDIA/aistore'],
        ],
      },
      {
        n: 9,
        title: '语言绑定与 SDK（7 个）',
        content: 'cuda-python：CUDA Python 绑定；cuda-quantum：量子-经典混合计算；CUDA-X：GPU 加速库集合；Holoscan SDK：边缘 AI 传感器处理 SDK；cuOpt Java：cuOpt Java SDK；NeMo Curator：GPU 加速数据清洗/去重管道；NeMo Retriever：企业级 RAG 检索微服务。',
        code: [
          ['NeMo Curator', 'https://github.com/NVIDIA-NeMo/Curator'],
          ['NeMo Retriever', 'https://github.com/NVIDIA-NeMo/retriever'],
        ],
      },
    ],
  },

  /* ── 1.4 NLP/AIGC/LLM 资源库 ── */
  {
    id: 'kg-nlp-aigc',
    order: 4,
    title: 'NLP / AIGC / LLM 资源库',
    titleEn: 'NLP / AIGC / LLM Resources',
    desc: '650+ 链接，50+ 类别，几乎最全的中文 NLP/AIGC/LLM 资源合集。',
    icon: '💬',
    cat: 'nvidia-resources',
    diff: 'hard',
    time: '25 分钟',
    overview: [['📊 资源', '650+'], ['🔖 类别', '50+']],
    steps: [
      {
        n: 1,
        title: '类 ChatGPT 与大型语言模型',
        content: '模型评测：ChatALL（同时与多个 AI 对话）、Chatbot Arena（匿名 Elo 评分）、C-Eval（中文评测 52 学科 13948 题）、OpenCompass（开源一站式评测框架）。LLM 资料与论文：Open LLMs、LLM Zoo、LLM Survey、PaLM 2 技术报告、GPT-4 终极指南、LLM 九层妖塔。开源框架：OpenLLaMA、OpenBuddy、MOSS、Open-Chinese-LLaMA、LLaMA-Adapter V2。',
        code: [
          ['ChatALL', 'https://github.com/sunner/ChatALL'],
          ['C-Eval', 'https://github.com/SJTU-LIT/ceval'],
          ['OpenCompass', 'https://github.com/internLM/OpenCompass/'],
        ],
        tip: 'C-Eval 是中文大模型评测标杆套件，覆盖 52 学科 13948 题，强烈推荐用于中文模型评估。',
      },
      {
        n: 2,
        title: 'NLP 核心任务',
        content: '文本分类与聚类：NeuralClassifier（腾讯）、TextCluster、TextAttack（对抗性攻击）、OpenBackdoor（后门攻防）。知识图谱：XLORE（清华跨语言）、132 个知识图谱数据集（14 领域）、14 亿实体中文知识图谱、awesome-knowledge-graph。文本生成与摘要：Texar、awesome-text-generation、awesome-nlg、TextRank4ZH。智能问答与对话：Haystack、ConvLab、Bot Framework、chatbot-list。',
        code: [
          ['NeuralClassifier', 'https://github.com/Tencent/NeuralNLP-NeuralClassifier'],
          ['Haystack (QA 框架)', 'https://github.com/deepset-ai/haystack'],
          ['14亿实体知识图谱', 'https://github.com/ownthink/KnowledgeGraphData'],
        ],
      },
      {
        n: 3,
        title: 'NLP 工具与平台',
        content: '综合 NLP 工具包：jieba（中文分词）、HanLP（中文 NLP）、Stanza（斯坦福 60+ 语言）、Forte、JioNLP、Texthero。文本标注与可视化：doccano（协同多语言标注）、brat（序列标注）、Scattertext（文本可视化）。',
        code: [
          ['jieba', 'https://github.com/fxsjy/jieba'],
          ['HanLP', 'https://github.com/hankcs/pyhanlp'],
          ['Stanza', 'https://github.com/stanfordnlp/stanza'],
        ],
      },
      {
        n: 4,
        title: '行业应用 NLP',
        content: '金融 NLP：awesome-financial-nlp、OpenData（金融投资数据）、Financial-Knowledge-Graphs。医疗 NLP：awesome_Chinese_medical_NLP、Medical-Dialogue-System（110 万咨询/400 万对话）、QASystemOnMedicalGraph。法律 NLP：Blackstone（spaCy 法律 pipeline）、awesome-legal-nlp、CrimeKgAssitant（856 项罪名知识图谱）。',
        code: [
          ['awesome-financial-nlp', 'https://github.com/icoxfog417/awesome-financial-nlp'],
          ['awesome_Chinese_medical_NLP', 'https://github.com/GanjinZero/awesome_Chinese_medical_NLP'],
        ],
      },
      {
        n: 5,
        title: '学习与竞赛资源',
        content: 'CS224n（斯坦福深度学习 NLP 课程）；nlp-tutorial（DL 研究者 NLP 实例教程）；ML-NLP（NLP 面试常考知识点）；NLPer-Arsenal（NLP 竞赛赛事/方案）；nlp-recipes（微软 NLP 最佳实践）。',
        code: [
          ['CS224n', 'http://web.stanford.edu/class/cs224n/'],
          ['nlp-tutorial', 'https://github.com/graykode/nlp-tutorial'],
        ],
      },
    ],
  },

  /* ── 1.5 开发工具链 ── */
  {
    id: 'kg-dev-toolchain',
    order: 5,
    title: '开发工具链',
    titleEn: 'Development Toolchain',
    desc: '130+ 项资源，覆盖核心平台、编辑器 IDE、语法高亮、LSP、AI Agent、代码工具。',
    icon: '🛠️',
    cat: 'nvidia-resources',
    diff: 'medium',
    time: '15 分钟',
    overview: [['📊 资源', '130+'], ['🔖 领域', '6 类']],
    steps: [
      {
        n: 1,
        title: '核心开发平台',
        content: 'Node.js（JavaScript 运行时）；Apple 开发者（iOS/macOS 开发）；OpenAI API 文档（GPT/Codex/DALL-E）；shadcn/ui（React 组件库搭建）。',
        code: [
          ['Node.js', 'https://nodejs.org/zh-cn'],
          ['shadcn/ui', 'https://ui.shadcn.com/create'],
        ],
      },
      {
        n: 2,
        title: '编辑器与 IDE 插件',
        content: 'TypeScript-TmLanguage（VSCode TS 语法高亮）；MagicPython（高级 Python 语法高亮）；marked（高性能 MD→HTML 转换）；Playwright MCP（浏览器自动化 MCP 集成）。',
        code: [
          ['TypeScript-TmLanguage', 'https://github.com/microsoft/TypeScript-TmLanguage'],
          ['Playwright MCP', 'https://github.com/microsoft/playwright-mcp'],
        ],
      },
      {
        n: 3,
        title: '语法高亮引擎（TextMate Bundle）',
        content: 'Better-* 增强系列 (jeff-hykin)：better-c-syntax（C11-C23）、better-cpp-syntax（C++20/23）、better-shell-syntax（Bash/Zsh）、better-objc-syntax。专业领域：go-syntax（Go 1.22+ 泛型）、rust-syntax（Rust 2021）、YAML-Syntax（YAML 1.2/K8s/CI-CD）、swift-tmlanguage（Swift 6.0）、LaTeX-Workshop。',
        code: [
          ['better-cpp-syntax', 'https://github.com/jeff-hykin/better-cpp-syntax'],
          ['go-syntax', 'https://github.com/worlpaker/go-syntax'],
        ],
      },
      {
        n: 4,
        title: '语言服务器协议（LSP）',
        content: 'rust-analyzer（Rust 官方语言服务器）；SourceKit-LSP（Swift/Obj-C Apple 官方 LSP）。',
        code: [
          ['rust-analyzer', 'https://github.com/rust-lang/rust-analyzer/releases'],
          ['SourceKit-LSP', 'https://github.com/swiftlang/sourcekit-lsp'],
        ],
      },
      {
        n: 5,
        title: 'AI 对话框架与 Agent',
        content: 'LibreChat（开源多 AI 模型对话平台，Next.js+TS）；Antigravity Skills（1400+ Agent 技能超级库）；CowAgent（轻量级多模态 AI 助理框架）。',
        code: [
          ['LibreChat', 'https://github.com/danny-avila/LibreChat'],
          ['Antigravity Skills', 'https://github.com/sickn33/antigravity-awesome-skills'],
        ],
      },
      {
        n: 6,
        title: '代码工具',
        content: 'js-beautify（JS/HTML/CSS 代码格式化）；Lucide Icons（开源图标库，Feather 继承）；Sentry（应用错误追踪）；Cursor IDE（AI 代码编辑器，VSCode 增强）。',
        code: [
          ['js-beautify', 'https://github.com/beautifier/js-beautify'],
          ['Lucide Icons', 'https://github.com/lucide-icons/lucide'],
        ],
      },
    ],
  },

  /* ── 1.6 DGX Spark 社区生态 ── */
  {
    id: 'kg-dgx-spark-community',
    order: 6,
    title: 'DGX Spark 社区生态',
    titleEn: 'DGX Spark Community',
    desc: '42 个社区项目，覆盖大模型部署、量化优化、微调训练、智能体应用、语音多模态、基础工具。',
    icon: '⚡',
    cat: 'nvidia-resources',
    diff: 'medium',
    time: '12 分钟',
    overview: [['📊 项目', '42 个'], ['🔖 分类', '6 类']],
    steps: [
      {
        n: 1,
        title: '大模型部署（模型推理）',
        content: 'DeepSeek-V4 部署（单台 DGX Spark）；GPT-OSS 120B 部署（桌面运行 1200 亿参数）；Qwen 3.5-122B NVFP4（vLLM 量化部署）；Minimax-M2.5 部署；Gemma-4 部署（llama.cpp）；GLM-4.7-FP8（sglang MoE 配置）；Nemotron-3-Super（Agent 部署）。',
        code: [
          ['DeepSeek-V4 部署', 'https://github.com/Entrpi/ds4-on-spark.git'],
          ['Qwen 3.5-122B NVFP4', 'https://github.com/jilycn/spark-vllm-122b.git'],
          ['Gemma-4 (llama.cpp)', 'https://github.com/shamily/gemma4-llama-dgx-spark.git'],
        ],
      },
      {
        n: 2,
        title: '量化与推理优化',
        content: 'KV 缓存量化（KV Cache 量化基准测试）；TurboQuant（2-4 位 KV 缓存量化，3.88x 压缩）；Optimized CUDA GB10（GB10 专用 CUDA 优化）。',
        tip: 'TurboQuant 实现 3.88x 压缩，是 DGX Spark 上降低显存占用的利器。',
        code: [
          ['TurboQuant', 'https://github.com/BioInfo/turboquant-dgx.git'],
          ['Optimized CUDA GB10', 'https://github.com/Logos-Flux/optimized-CUDA-GB10.git'],
        ],
      },
      {
        n: 3,
        title: '微调与训练',
        content: 'Fine-Tuning Llama 3.1-70B（DGX Spark 上微调 70B）；dgx-spark-finetune-llm（轻松微调语言模型）。',
        code: [
          ['Fine-Tuning Llama 3.1-70B', 'https://github.com/sanjbasu/Fine-Tuning-Llama-3.1-70B-on-DGX-Spark.git'],
          ['dgx-spark-finetune-llm', 'https://github.com/MoHussein197/dgx-spark-finetune-llm.git'],
        ],
      },
      {
        n: 4,
        title: '智能体与应用',
        content: 'AGmind（全栈 AI Agent 部署）；Agent Swarm（多智能体集群部署）；ClawSpark；SparkView（DGX Spark 监控面板）。',
        code: [
          ['AGmind', 'https://github.com/botAGI/AGmind.git'],
          ['SparkView 监控面板', 'https://github.com/parallelArchitect/sparkview.git'],
        ],
      },
      {
        n: 5,
        title: '语音与多模态',
        content: '语音管道部署（实时语音助手，766ms 首音频延迟）；Spark 实时聊天机器人。',
        code: [
          ['语音管道 (766ms 延迟)', 'https://github.com/Logos-Flux/spark-voice-pipeline.git'],
          ['Spark 实时聊天机器人', 'https://github.com/kedarpotdar-nv/spark-realtime-chatbot.git'],
        ],
      },
      {
        n: 6,
        title: '基础设施工具',
        content: 'DGX Spark Toolkit（硬件/网络/应用验证脚本集）；Spark Setup（环境搭建）；DGX Model Manager（模型管理器）。',
        code: [
          ['DGX Spark Toolkit', 'https://github.com/dorangao/dgx-spark-toolkit.git'],
          ['DGX Model Manager', 'https://github.com/calico88x/DGX-Model-Manager.git'],
        ],
      },
    ],
  },

  /* ── 1.7 平台服务与基础设施 ── */
  {
    id: 'kg-platform-infra',
    order: 7,
    title: '平台服务与基础设施',
    titleEn: 'Platform Services & Infrastructure',
    desc: '60+ 项资源，覆盖国产 AI 大模型、云服务 API、NAS DevOps、3D AI 创作、代码编辑器。',
    icon: '☁️',
    cat: 'nvidia-resources',
    diff: 'medium',
    time: '12 分钟',
    overview: [['📊 资源', '60+'], ['🔖 分类', '5 类']],
    steps: [
      {
        n: 1,
        title: '国产 AI 大模型平台',
        content: '智谱 AI (ChatGLM)；DeepSeek；CodeGeeX（代码生成）；秘塔 AI 搜索；通义千问；Kimi（长文本 LLM）。',
        code: [
          ['智谱 AI', 'https://chatglm.cn'],
          ['DeepSeek', 'https://www.deepseek.com'],
          ['Kimi', 'https://kimi.moonshot.cn'],
        ],
      },
      {
        n: 2,
        title: '云服务平台 API',
        content: 'Google Cloud API；Google OAuth（认证服务）；Apple 开发者；OpenAI API（GPT/Codex）；HuggingFace MCP（模型服务）。',
        code: [
          ['OpenAI API', 'https://platform.openai.com/docs/overview'],
          ['HuggingFace MCP', 'https://huggingface.co/settings/mcp'],
        ],
      },
      {
        n: 3,
        title: 'NAS 与 DevOps 工具链',
        content: '数据库管理：Adminer（MySQL/MariaDB）、pgAdmin 4（PostgreSQL）。监控与可观测性：Prometheus（时序数据库）、Grafana（可视化面板）。媒体服务器：Plex（家庭影院）、Jellyfin（开源媒体中心）。',
        code: [
          ['Prometheus', 'https://prometheus.io/'],
          ['Grafana', 'https://grafana.com/'],
        ],
      },
      {
        n: 4,
        title: '3D 与 AI 创作工具',
        content: 'ReadyPlayerMe（3D 头像，跨平台数字人形象）；Luma Dream Machine（AI 视频，文本/图像转视频）；即梦 AI（一站式创作平台）。',
        code: [
          ['ReadyPlayerMe', 'https://readyplayer.me/'],
          ['Luma Dream Machine', 'https://dream-machine.lumalabs.ai/'],
        ],
      },
      {
        n: 5,
        title: 'AI 代码编辑器',
        content: 'Cursor IDE（AI 代码编辑器，VSCode 增强）；Sentry（应用错误追踪）。',
        code: [
          ['Cursor IDE', 'https://cursor.com/'],
          ['Sentry', 'https://sentry.io/'],
        ],
      },
    ],
  },

  /* ── 1.8 附录：关联图谱与学习路径 ── */
  {
    id: 'kg-appendix',
    order: 8,
    title: '附录 · 关联图谱与学习路径',
    titleEn: 'Appendix: Graph & Learning Paths',
    desc: '核心依赖关系、典型工作流、DGX Spark/NLP 推荐学习路径、技术栈分布与文档来源映射。',
    icon: '📚',
    cat: 'nvidia-resources',
    diff: 'easy',
    time: '10 分钟',
    steps: [
      {
        n: 1,
        title: '核心依赖关系图谱',
        content: 'NVIDIA GPU 硬件 (DGX Spark/H100) 向下分为三大生态：① CUDA 生态（CCCL/cuPy/cuDF）② NIM API（Brev/NIM/NGC）③ Holoscan SDK（Isaac/DALI/HoloHub）。',
        tip: '理解三大生态的定位差异是选型的关键：CUDA 偏底层计算，NIM 偏推理服务，Holoscan 偏边缘应用。',
      },
      {
        n: 2,
        title: '典型工作流',
        content: '工作流 1 (CUDA C++ 高性能计算)：安装 CUDA Toolkit → 配置 VSCode+cuda-cpp-grammar → 编写 CUDA Kernel → CCCL 并行算法 → 性能分析 → 部署。工作流 2 (Python AI 数据科学)：cuda-python 绑定 → DALI 数据加载 → 训练 DL 模型 → NIM API 推理 → Brev.dev 托管。工作流 3 (边缘 AI 机器人)：Isaac ROS 感知 → Holoscan 流式处理 → Jetson Orin 边缘推理 → Sim2Real 仿真验证。',
      },
      {
        n: 3,
        title: 'DGX Spark 用户推荐学习路径',
        content: '阶段一（1-2 周）：DGX Spark 环境搭建（spark-doctor → vLLM → Qwen3.5-122B → SparkView）。阶段二（2-3 周）：模型部署实战（DeepSeek-V4 → Gemma-4 → TurboQuant → 语音助手）。阶段三（2-4 周）：Agent 与微调（AGmind → Agent Swarm → Unsloth 微调 → Hackathon）。',
      },
      {
        n: 4,
        title: 'NLP 研究者推荐学习路径',
        content: '基础：CS224n 课程 → nlp-tutorial 实践 → jieba/HanLP/Stanza 工具。进阶：LLM Survey 论文 → OpenLLaMA 复现 → LoRA 微调。应用：知识图谱构建 → 智能问答系统 → RAG pipeline。',
      },
      {
        n: 5,
        title: '技术栈分布',
        content: 'Python 35 项 (28%)；Go 7 项 (6%)；C++/CUDA 6 项 (5%)；TypeScript 6 项 (5%)；Rust 3 项 (2%)；Java 3 项 (2%)；Docker/K8s 20+ 项 (16%)。',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     第二部分：NVIDIA NIM 138 款模型全量分类分析（10 大类别）
     ═══════════════════════════════════════════════════════════════ */

  /* ── 2.1 NIM 全景总览 ── */
  {
    id: 'nim-overview',
    order: 9,
    title: 'NIM 138 款模型 · 全景总览',
    titleEn: 'NIM 138 Models Overview',
    desc: '基于 build.nvidia.com 官方模型库，138 款模型按功能领域全量分类，含 DGX Spark 单/双机部署选型。',
    icon: '🧠',
    cat: 'nim-models',
    diff: 'easy',
    time: '8 分钟',
    overview: [['📊 模型总数', '138'], ['🗂️ 类别', '10 大'], ['🎯 维度', '4 大']],
    steps: [
      {
        n: 1,
        title: '十大类别全景',
        content: '① 大语言模型（32 款）— 核心推理引擎；② 多模态与视觉语言模型（18 款）— 跨模态理解；③ RAG 知识库全链路组件（21 款）— 知识库基础设施；④ 语音音频类模型（15 款）— 语音交互全链路；⑤ 图像生成与编辑模型（9 款）— AIGC 生产；⑥ 视频与媒体处理模型（10 款）— 广电媒体 AI；⑦ 生物科技与药物发现模型（13 款）— 生命科学算力；⑧ 自动驾驶与物理 AI 模型（9 款）— 智能系统仿真；⑨ 安全合规模型（8 款）— AI 系统安全护栏；⑩ 行业专用工具模型（3 款）— 垂直领域算力工具。',
        tip: '大语言模型类（32 款）是数量最多的类别，是核心推理算力载体，也是双机 DGX Spark 部署的核心对象。',
      },
      {
        n: 2,
        title: '四大分析维度',
        content: '本文从四大维度深度解析：① 定位能力（核心功能与适用场景）；② 行业适配（推荐度与目标行业）；③ 单/双机 DGX Spark 部署（128GB/256GB 适配性）；④ 环境配置（量化策略、并行方案、推理引擎）。',
      },
    ],
  },

  /* ── 2.2 大语言模型类（32 款）── */
  {
    id: 'nim-llm',
    order: 10,
    title: '大语言模型类（32 款）',
    titleEn: 'Large Language Models',
    desc: '核心推理算力载体，含旗舰 MoE、中大型通用、轻量边缘三档，覆盖对话/编码/智能体全场景。',
    icon: '🤖',
    cat: 'nim-models',
    diff: 'hard',
    time: '20 分钟',
    overview: [['📊 数量', '32 款'], ['🏆 推荐', '旗舰 10 款']],
    steps: [
      {
        n: 1,
        title: '旗舰级编码 & 智能体 MoE（10 款，企业生产首选）',
        content: 'MoE 稀疏架构，总参数量大、激活参数少，长上下文强，主打代码生成/智能体规划/复杂推理，是双机 DGX Spark 核心部署对象。nemotron-3-ultra-550b-a55b（NVIDIA，550B 混合 Mamba-Transformer MoE，1M 上下文，全能旗舰 ★★★★★）；deepseek-v4-flash（DeepSeek，284B MoE，高速编码，代码标杆 ★★★★★）；deepseek-v4-pro（DeepSeek，284B MoE，高阶推理精度 ★★★★☆）；glm-5.2（Z.ai，国产旗舰 MoE，中文生态完善 ★★★★★）；kimi-k2.6（Moonshot，1T 多模态 MoE ★★★★☆）；step-3.7-flash（Stepfun，企业级编码 ★★★★）；nemotron-3-super-120b-a12b（NVIDIA，120B MoE，1M 上下文 ★★★★）；mistral-medium-3.5-128b（Mistral，128B 稠密旗舰 ★★★★）。',
        tip: '双机 TP=2 张量并行可稳定承载 1M 上下文；单机 NVFP4 量化可部署但长上下文并发受限。',
        code: [
          ['nemotron-3-ultra-550b NIM', 'https://build.nvidia.com/nvidia/nemotron-3-ultra-550b-a55b'],
          ['deepseek-v4-flash NIM', 'https://build.nvidia.com/deepseek/deepseek-v4-flash'],
          ['glm-5.2 NIM', 'https://build.nvidia.com/z-ai/glm-5.2'],
        ],
      },
      {
        n: 2,
        title: '中大型通用推理 LLM（10 款，均衡型业务底座）',
        content: '参数中等，稠密或轻量 MoE，通用对话/知识问答/轻量代码均衡，适合单机部署。gemma-4-31b-it（Google，31B 稠密 ★★★☆）；mistral-small-4-119b-2603（Mistral，256K 上下文+多模态 ★★★★）；llama-3.3-70b-instruct（Meta，70B 开源旗舰 ★★★★）；llama-3.1-70b-instruct（Meta，经典 70B 基准 ★★★★）；llama-3.3-nemotron-super-49b-v1.5（NVIDIA，49B 高效 ★★★★）；gpt-oss-120b（OpenAI，120B MoE 数学逻辑 ★★★）；mixtral-8x7b-instruct-v0.1（Mistral，经典 8x7B MoE ★★★☆）；seed-oss-36b-instruct（ByteDance，长上下文 ★★★☆）。',
        code: [
          ['llama-3.3-70b-instruct NIM', 'https://build.nvidia.com/meta/llama-3.3-70b-instruct'],
          ['llama-3.1-70b-instruct NIM', 'https://build.nvidia.com/meta/llama-3.1-70b-instruct'],
        ],
      },
      {
        n: 3,
        title: '轻量与边缘端 LLM（12 款，高并发低成本）',
        content: '参数小、延迟低、资源占用少，适合单机多实例并发、边缘部署。laguna-xs-2.1（Poolside，33B MoE，本地智能体编程 ★★★★）；nemotron-3-nano-30b-a3b（NVIDIA，30B MoE，1M 上下文 ★★★★）；nvidia-nemotron-nano-9b-v2（NVIDIA，9B 混合 Mamba，低延迟高吞吐 ★★★）；nemotron-mini-4b-instruct（NVIDIA，4B，RAG/函数调用 ★★☆）；llama-3.2-90b-vision-instruct（Meta，90B VLM ★★★★）；llama-3.2-3b/1b-instruct（Meta，轻量文本）；gemma-3n-e4b/e2b-it（Google，边缘多模态）；gemma-2-2b-it（Google，端侧文本）。',
        tip: 'nemotron-mini-4b 量化后 <5GB 资源占用，可上百实例并发，适合极致成本场景。',
      },
    ],
  },

  /* ── 2.3 多模态与视觉语言模型类（18 款）── */
  {
    id: 'nim-multimodal',
    order: 11,
    title: '多模态与视觉语言模型（18 款）',
    titleEn: 'Multimodal & Vision-Language Models',
    desc: '跨模态理解核心，覆盖通用多模态推理与量子计算、物理世界、文档等专用领域。',
    icon: '👁️',
    cat: 'nim-models',
    diff: 'medium',
    time: '12 分钟',
    overview: [['📊 数量', '18 款'], ['🎯 子类', '通用+专用']],
    steps: [
      {
        n: 1,
        title: '通用多模态推理模型',
        content: '支持文本+图像+视频多输入，覆盖通用场景推理/问答/分析。minimax-m3（Minimax，多模态 MoE VLM ★★★★）；inkling（Thinkingmachines，Mamba 混合 256 专家 MoE，可切换推理 ★★★★）；mistral-small-4-119b-2603（Mistral，256K 上下文多模态 ★★★★）；nemotron-nano-12b-v2-vl（NVIDIA，12B 多图视频理解 ★★★☆）；llama-3.1-nemotron-nano-vl-8b-v1（NVIDIA，8B 轻量图文/OCR ★★★）；paligemma（Google，轻量 VLM ★★☆）；llama-4-maverick-17b-128e-instruct（Meta，17B 128 专家 MoE ★★★）。',
        code: [
          ['minimax-m3 NIM', 'https://build.nvidia.com/minimax/minimax-m3'],
        ],
      },
      {
        n: 2,
        title: '专用领域多模态模型',
        content: '面向量子计算、物理世界、文档等垂直领域深度优化。ising-calibration-1.5-31b（NVIDIA，基于 Gemma 4 31B 量子计算多模态，校准实验图表 ★★★★）；ising-calibration-1-35b-a3b（NVIDIA，量子校准图表 VLM ★★★★）；cosmos3-nano-reasoner（NVIDIA，物理世界 VLM，视频/图像结构化推理 ★★★★）；cosmos-reason2-8b（NVIDIA，8B 物理世界 VLM ★★★☆）；nemotron-parse（NVIDIA，文档解析 VLM ★★★★）；nemoretriever-parse（NVIDIA，OCR+表格提取 ★★★★）；qwen-image-edit-nvpcb-ovsl2sl（NVIDIA，PCB 检测图像编辑 ★★★★）。',
        tip: '量子校准模型 (ising-calibration) 是科研院所量子计算场景的稀缺专用模型。',
      },
    ],
  },

  /* ── 2.4 RAG 知识库全链路组件（21 款）── */
  {
    id: 'nim-rag',
    order: 12,
    title: 'RAG 知识库全链路组件（21 款）',
    titleEn: 'RAG Knowledge Base Components',
    desc: '完整覆盖「文档解析→向量化→检索→重排」知识库全链路，企业私有化知识系统核心组件。',
    icon: '🔍',
    cat: 'nim-models',
    diff: 'medium',
    time: '15 分钟',
    overview: [['📊 数量', '21 款'], ['🔗 链路', '解析→嵌入→重排']],
    steps: [
      {
        n: 1,
        title: '嵌入模型（Embedding）：向量化核心',
        content: 'nemotron-3-embed-1b（NVIDIA，1B 代码语义嵌入，RAG/代码检索 ★★★★★）；nv-embedcode-7b-v1（NVIDIA，7B 代码嵌入 ★★★★）；llama-nemotron-embed-1b-v2（NVIDIA，26 种语言跨语种 ★★★★）；llama-nemotron-embed-vl-1b-v2（NVIDIA，多模态问答嵌入 ★★★★）；nv-embedqa-e5-v5（NVIDIA，英文 QA 嵌入 ★★★★）；bge-m3（BAAI，稠密/多向量/稀疏多模式，中文标杆 ★★★★★）；esm2-650m（Meta，蛋白质序列嵌入 ★★★★）。',
        tip: 'bge-m3 是中文知识库检索的标杆，支持稠密/多向量/稀疏多模式检索，与政企文档场景高度适配。',
      },
      {
        n: 2,
        title: '重排模型（Rerank）：检索精度放大器',
        content: 'llama-nemotron-rerank-1b-v2（NVIDIA，GPU 加速文本重排，段落相关性打分 ★★★★）；llama-nemotron-rerank-vl-1b-v2（NVIDIA，多模态重排 ★★★★）；rerank-qa-mistral-4b（NVIDIA，4B 问答重排 ★★★☆）。',
        code: [
          ['llama-nemotron-rerank-1b-v2 NIM', 'https://build.nvidia.com/nvidia/llama-nemotron-rerank-1b-v2'],
        ],
      },
      {
        n: 3,
        title: 'OCR 与文字识别：非结构化文档入口',
        content: 'nemotron-ocr-v2（NVIDIA，端到端多语言 OCR，复杂场景表格提取 ★★★★★）；nemotron-ocr-v1（NVIDIA，第一代高速 OCR ★★★★）；nemoretriever-ocr（NVIDIA，文本/布局/结构分析 ★★★★）；paddleocr（Baidu，开源中文场景优化 ★★★★）；whisper-large-v3（OpenAI，语音识别转写多语言 ★★★★）。',
        code: [
          ['nemotron-ocr-v2 NIM', 'https://build.nvidia.com/nvidia/nemotron-ocr-v2'],
        ],
      },
      {
        n: 4,
        title: '版面与图表元素检测：文档结构化前置',
        content: 'nemotron-page-elements-v3（NVIDIA，文档目标检测图表/表格/标题 ★★★★）；nemotron-table-structure-v1（NVIDIA，表格结构检测 ★★★★）；nemotron-graphic-elements-v1（NVIDIA，图形元素检测 ★★★☆）；nemoretriever-page-elements-v2（NVIDIA，版面元素检测 ★★★★）；nv-yolox-page-elements-v1（NVIDIA，YOLOX 高速轻量 ★★★☆）。',
        tip: '版面检测是文档数字化的前置步骤，建议与 OCR + 嵌入模型组成流水线部署。',
      },
    ],
  },

  /* ── 2.5 语音音频类模型（15 款）── */
  {
    id: 'nim-speech',
    order: 13,
    title: '语音音频类模型（15 款）',
    titleEn: 'Speech & Audio Models',
    desc: '语音交互全链路，覆盖语音识别 ASR、语音合成 TTS、音频增强与翻译。',
    icon: '🎙️',
    cat: 'nim-models',
    diff: 'medium',
    time: '12 分钟',
    overview: [['📊 数量', '15 款'], ['🎯 链路', 'ASR→TTS→增强']],
    steps: [
      {
        n: 1,
        title: '语音识别（ASR）',
        content: 'nemotron-asr-streaming（NVIDIA，实时英语流式 ★★★★）；parakeet-ctc-0.6b-zh-cn（NVIDIA，中英双语+标点时间戳，中文标杆 ★★★★★）；parakeet-ctc-0.6b-zh-tw/es/vi（台语/西语/越南语）；parakeet-1.1b-rnnt-multilingual-asr（NVIDIA，25 种语言 ★★★★）；canary-1b-asr（NVIDIA，多语言识别+翻译一体化 ★★★★）；whisper-large-v3（OpenAI，开源大参多语言 ★★★★）。',
        tip: 'parakeet-ctc-0.6b-zh-cn 是中文 ASR 精度标杆，带标点与时间戳，适合客服/会议纪要场景。',
      },
      {
        n: 2,
        title: '语音合成（TTS）',
        content: 'chatterbox-multilingual-tts（Resemble.AI，23 种语言自然表现力 ★★★★）；magpie-tts-multilingual（NVIDIA，多语言自然合成，Riva 整合 ★★★★）；magpie-tts-zeroshot（NVIDIA，零样本音色克隆 ★★★★）。',
        code: [
          ['chatterbox-tts NIM', 'https://build.nvidia.com/resemble-ai/chatterbox-multilingual-tts'],
        ],
      },
      {
        n: 3,
        title: '音频增强与翻译',
        content: 'Background Noise Removal（NVIDIA，背景噪音消除 ★★★★）；Studio Voice（NVIDIA，低质录音增强工作室级 ★★★★）；riva-translate-4b-instruct-v1_1（NVIDIA，12 种语言少样本翻译 ★★★★）；riva-translate-1.6b（NVIDIA，36 种语言翻译 ★★★★）；nemotron-voicechat（NVIDIA，英语语音对话一体化 ★★★☆）。',
      },
    ],
  },

  /* ── 2.6 图像生成与编辑模型（9 款）── */
  {
    id: 'nim-image-gen',
    order: 14,
    title: '图像生成与编辑模型（9 款）',
    titleEn: 'Image Generation & Editing',
    desc: 'AIGC 内容生产，覆盖文生图、图生图、图像编辑全场景。',
    icon: '🎨',
    cat: 'nim-models',
    diff: 'medium',
    time: '10 分钟',
    overview: [['📊 数量', '9 款'], ['🎯 主流', 'FLUX 系列']],
    steps: [
      {
        n: 1,
        title: 'FLUX 系列（旗舰文生图）',
        content: 'FLUX.1-dev（Black Forest Labs，旗舰文生图最高质量 ★★★★★）；FLUX.1-schnell（蒸馏版高速生成 ★★★★）；FLUX.1-Kontext-dev（上下文图像生成编辑，图生图+文字引导 ★★★★）；flux.2-klein-4b（4B 蒸馏极速输出 ★★★☆）。',
        tip: 'FLUX.1-schnell 蒸馏版适合批量内容生产，FLUX.1-dev 适合高质量创意生产。',
        code: [
          ['FLUX.1-dev NIM', 'https://build.nvidia.com/black-forest-labs/flux-1-dev'],
          ['FLUX.1-schnell NIM', 'https://build.nvidia.com/black-forest-labs/flux-1-schnell'],
        ],
      },
      {
        n: 2,
        title: '其他图像生成与编辑',
        content: 'stable-diffusion-3.5-large（Stability AI，经典 SD3.5 文生图基准 ★★★★）；qwen-image（Qwen，多语言文本渲染 ★★★★）；qwen-image-edit（Qwen，多语言文字编辑主体一致 ★★★★）；qwen-image-edit-nvpcb-ovsl2sl（NVIDIA，PCB 工业图像风格转换 ★★★★）；TRELLIS（Microsoft，文本/图像生成 3D 资产 ★★★★）。',
        code: [
          ['stable-diffusion-3.5-large NIM', 'https://build.nvidia.com/stabilityai/stable-diffusion-3.5-large'],
          ['TRELLIS NIM', 'https://build.nvidia.com/microsoft/trellis'],
        ],
      },
    ],
  },

  /* ── 2.7 视频与媒体处理模型（10 款）── */
  {
    id: 'nim-video',
    order: 15,
    title: '视频与媒体处理模型（10 款）',
    titleEn: 'Video & Media Processing',
    desc: '广电与媒体 AI，覆盖视频超分、唇形同步、打光、说话人检测、合成检测。',
    icon: '🎬',
    cat: 'nim-models',
    diff: 'medium',
    time: '8 分钟',
    overview: [['📊 数量', '10 款']],
    steps: [
      {
        n: 1,
        title: '视频增强与制作',
        content: 'Video Super Resolution NIM（NVIDIA，视频超分辨率编码/ST 2110 升分辨率 ★★★★★）；LipSync（NVIDIA，生成式唇形同步，视频对口型配音 ★★★★）；Relighting（NVIDIA，视频人物重打光 360 HDRI ★★★★）；Active Speaker Detection（NVIDIA，视频说话人检测身份追踪 ★★★★）；eyecontact（NVIDIA，视频眼神矫正 ★★★☆）。',
        tip: 'Video Super Resolution 支持 ST 2110 视频协议，是广电/直播场景实时超分首选。',
      },
      {
        n: 2,
        title: '合成检测与物理仿真',
        content: 'synthetic-video-detector（NVIDIA，AI 合成视频检测鉴伪取证 ★★★★）；cosmos3-nano（NVIDIA，文本/图像生成物理感知视频 ★★★★）；cosmos-transfer1-7b（NVIDIA，文本+空间控制生成物理视频 ★★★★）；cosmos-transfer2.5-2b（NVIDIA，轻量物理视频生成 ★★★☆）。',
        warning: 'synthetic-video-detector 是媒体风控与内容合规的必备鉴伪工具。',
      },
    ],
  },

  /* ── 2.8 生物科技与药物发现模型（13 款）── */
  {
    id: 'nim-bio',
    order: 16,
    title: '生物科技与药物发现模型（13 款）',
    titleEn: 'Biotech & Drug Discovery',
    desc: '生命科学算力引擎，覆盖蛋白结构预测、分子生成、药物研发全管线。',
    icon: '🧬',
    cat: 'nim-models',
    diff: 'hard',
    time: '12 分钟',
    overview: [['📊 数量', '13 款'], ['🏆 核心', '结构预测']],
    steps: [
      {
        n: 1,
        title: '蛋白结构预测（核心管线）',
        content: 'openfold3（Openfold，第三代生物分子基础模型，蛋白/DNA/RNA/配体复合物 3D 结构 ★★★★★）；alphafold2（DeepMind，经典蛋白结构预测行业基准 ★★★★★）；alphafold2-multimer（DeepMind，多聚体蛋白 ★★★★★）；esmfold（Meta，单序列快速预测 ★★★★）；openfold2（Openfold，第二代 MSA+模板 ★★★★）；Boltz-2（MIT，复杂结构预测 ★★★★）。',
        tip: 'openfold3 是新一代结构预测，覆盖蛋白/DNA/RNA/配体复合物，是药物研发管线起点。',
        code: [
          ['alphafold2 NIM', 'https://build.nvidia.com/deepmind/alphafold2'],
          ['openfold3 NIM', 'https://build.nvidia.com/openfold/openfold3'],
        ],
      },
      {
        n: 2,
        title: '蛋白设计与分子生成',
        content: 'proteinmpnn（IPD，蛋白骨架氨基酸序列设计 ★★★★）；rfdiffusion（IPD，蛋白骨架生成，结合剂设计，抗体药物核心 ★★★★★）；molmim（NVIDIA，可控分子生成，属性定向优化 ★★★★）；genmol（NVIDIA，片段基离散扩散分子生成 ★★★☆）；evo2-40b（Arc，40B 生物基础模型，长基因组 ★★★★）。',
        code: [
          ['rfdiffusion NIM', 'https://build.nvidia.com/ipd/rfdiffusion'],
          ['molmim NIM', 'https://build.nvidia.com/nvidia/molmim'],
        ],
      },
      {
        n: 3,
        title: '分子对接与序列检索',
        content: 'diffdock（MIT，分子-蛋白对接结构预测，高通量虚拟筛选 ★★★★）；msa-search（Colabfold，多序列比对生成，结构预测前置 ★★★☆）。',
        code: [
          ['diffdock NIM', 'https://build.nvidia.com/mit/diffdock'],
        ],
      },
    ],
  },

  /* ── 2.9 自动驾驶与物理 AI 模型（9 款）── */
  {
    id: 'nim-auto',
    order: 17,
    title: '自动驾驶与物理 AI 模型（9 款）',
    titleEn: 'Autonomous Driving & Physical AI',
    desc: '智能系统仿真与感知，覆盖端到端自动驾驶、3D 感知、物理世界仿真。',
    icon: '🚗',
    cat: 'nim-models',
    diff: 'hard',
    time: '10 分钟',
    overview: [['📊 数量', '9 款']],
    steps: [
      {
        n: 1,
        title: '自动驾驶感知',
        content: 'sparsedrive（NVIDIA，端到端自动驾驶栈，感知+预测+规划 ★★★★★）；bevformer（NVIDIA，多帧 BEV 3D 感知 Transformer ★★★★）；streampetr（NVIDIA，高效 3D 目标检测，时序稀疏 ★★★★）。',
        tip: 'sparsedrive 全栈自动驾驶方案，效率与安全兼顾，适合商用车智能化原型部署。',
        code: [
          ['sparsedrive NIM', 'https://build.nvidia.com/nvidia/sparsedrive'],
          ['bevformer NIM', 'https://build.nvidia.com/nvidia/bevformer'],
        ],
      },
      {
        n: 2,
        title: '物理世界仿真与推理',
        content: 'cosmos3-nano（NVIDIA，文本/图像生成物理感知视频，仿真数据 ★★★★）；cosmos3-nano-reasoner（NVIDIA，物理世界 VLM 结构化推理 ★★★★）；cosmos-transfer1-7b（NVIDIA，物理视频世界状态生成，空间控制 ★★★★）；cosmos-transfer2.5-2b（NVIDIA，轻量物理视频生成 ★★★☆）；cosmos-reason2-8b（NVIDIA，8B 物理世界推理 VLM ★★★☆）；qwen-image-edit-nvpcb-ovsl2sl（NVIDIA，PCB 工业图像风格转换 ★★★★）。',
      },
    ],
  },

  /* ── 2.10 安全合规模型（8 款）── */
  {
    id: 'nim-safety',
    order: 18,
    title: '安全合规模型（8 款）',
    titleEn: 'Safety & Compliance Models',
    desc: 'AI 系统安全护栏，覆盖内容安全、越狱检测、PII 识别、话题管控、合成检测。',
    icon: '🛡️',
    cat: 'nim-models',
    diff: 'medium',
    time: '10 分钟',
    overview: [['📊 数量', '8 款'], ['🎯 定位', '安全前置']],
    steps: [
      {
        n: 1,
        title: '内容安全与越狱检测',
        content: 'nemotron-3.5-content-safety（NVIDIA，多语言多模态内容安全，全场景审核 ★★★★★）；llama-guard-4-12b（Meta，多模态输入输出安全分类 ★★★★）；llama-3.1-nemotron-safety-guard-8b-v3（NVIDIA，多语言内容安全增强 ★★★★）；nemoguard-jailbreak-detect（NVIDIA，越狱检测分类，对抗 Prompt 防护 ★★★★★）；llama-3.1-nemoguard-8b-content-safety（NVIDIA，内容安全增强 ★★★★）。',
        warning: 'nemoguard-jailbreak-detect 是企业 LLM 安全/API 网关的必备前置防护，对抗 Prompt 注入。',
        code: [
          ['nemotron-3.5-content-safety NIM', 'https://build.nvidia.com/nvidia/nemotron-3.5-content-safety'],
          ['nemoguard-jailbreak-detect NIM', 'https://build.nvidia.com/nvidia/nemoguard-jailbreak-detect'],
        ],
      },
      {
        n: 2,
        title: '话题管控与隐私保护',
        content: 'llama-3.1-nemoguard-8b-topic-control（NVIDIA，话题管控，限定合规主题 ★★★★）；gliner-pii（NVIDIA，文本 PII 检测，GDPR/等保合规必备 ★★★★★）；synthetic-video-detector（NVIDIA，AI 合成视频检测 ★★★★）。',
        tip: 'gliner-pii 是数据脱敏与隐私合规（GDPR/等保）的必备组件，PII 识别精准。',
        code: [
          ['gliner-pii NIM', 'https://build.nvidia.com/nvidia/gliner-pii'],
        ],
      },
    ],
  },

  /* ── 2.11 行业专用工具模型（3 款）── */
  {
    id: 'nim-industry',
    order: 19,
    title: '行业专用工具模型（3 款）',
    titleEn: 'Industry-Specific Tool Models',
    desc: '垂直领域算力工具：路径优化、气象预测、3D 医疗分割。',
    icon: '📐',
    cat: 'nim-models',
    diff: 'medium',
    time: '6 分钟',
    overview: [['📊 数量', '3 款']],
    steps: [
      {
        n: 1,
        title: '路径优化与气象预测',
        content: 'cuOpt（NVIDIA，世界领先路径优化求解器，物流/仓储/出行调度 ★★★★★）；fourcastnet（NVIDIA，全球大气动力学气象预测，AI 气象速度远超传统数值模式 ★★★★）。',
        tip: 'cuOpt 是物流调度刚需，单机求解中等规模，双机求解超大规模路径规划。',
        code: [
          ['cuOpt NIM', 'https://build.nvidia.com/nvidia/cuopt'],
          ['fourcastnet NIM', 'https://build.nvidia.com/nvidia/fourcastnet'],
        ],
      },
      {
        n: 2,
        title: '医疗 3D 分割',
        content: 'vista-3d（NVIDIA，交互式人体解剖分割标注 3D 基础模型，医疗影像/医学教育 ★★★★）。适合辅助诊断与标注场景。',
        code: [
          ['vista-3d NIM', 'https://build.nvidia.com/nvidia/vista-3d'],
        ],
      },
    ],
  },

  /* ── 2.12 DGX Spark 部署选型总览 ── */
  {
    id: 'nim-deployment',
    order: 20,
    title: 'DGX Spark 单/双机部署选型',
    titleEn: 'Deployment Selection Guide',
    desc: 'GB10 单台 128GB / 双机 256GB TP=2 张量并行部署选型总览与环境配置标准。',
    icon: '🖥️',
    cat: 'nim-models',
    diff: 'hard',
    time: '15 分钟',
    overview: [['📊 单机', '128GB'], ['📊 双机', '256GB TP=2']],
    steps: [
      {
        n: 1,
        title: '单机部署最优模型组合（128GB 统一内存）',
        content: '定位：中小团队私有化、部门级业务、原型验证。核心分配策略：主 LLM 占 60% 内存，配套组件占 25%，系统预留 15%。① 代码助手+知识库：deepseek-v4-flash (INT4) 或 glm-5.2 (NVFP4) + nemotron-ocr-v2 + embed-1b + rerank-1b-v2，~95GB，3-5 路并发。② 通用企业知识库：nemotron-3-super-120b + nemotron-ocr-v2 + bge-m3 + rerank + content-safety，~80GB，8-10 路并发。③ 多模态内容生产：minimax-m3 + FLUX.1-schnell + OCR + 内容安全，~90GB，2-3 路图文。④ 生物科研：AlphaFold2 + ESMFold + 序列嵌入 + 分子生成，~70GB，批量蛋白预测。',
      },
      {
        n: 2,
        title: '双机部署最优模型组合（256GB TP=2 张量并行）',
        content: '双机通过 200Gbps RoCE 高速互联，张量并行拆分大模型权重。① 企业级代码知识库（首选）：deepseek-v4-flash (NVFP4, 1M 上下文) + 嵌入 + 向量库 / OCR + 安全 + 重排。② 中文政企智能平台：glm-5.2 (NVFP4, 128K) + 中文嵌入 bge-m3 / OCR + 安全 + 文档解析。③ 旗舰智能体平台：nemotron-3-ultra-550b + 工具调用网关 / 多模态 + 安全 + 语音。④ 多模态内容生产：kimi-k2.6 + 图像 FLUX / 视频 + 语音 + 审核。',
        tip: '双机 TP=2 可稳定承载 1M 上下文，吞吐量翻倍；单机 NVFP4 量化可部署但长上下文并发受限。',
      },
      {
        n: 3,
        title: '双机部署统一环境配置标准',
        content: '① 底层系统：DGX OS 6.2+，NVIDIA Driver 560+，CUDA 12.8，NCCL 2.29+。② 互联配置：RoCE v2 协议，200Gbps ConnectX-7 直连，开启 GPUDirect RDMA。③ 容器运行时：统一 NVIDIA NIM 官方容器，docker-compose 编排。④ 量化标准：主 LLM 采用 NVFP4 混合量化（注意力层 BF16 + FFN 层 NVFP4），KV 缓存统一 FP8 压缩。⑤ 推理引擎：大模型优先 vLLM 0.7+，开启张量并行；小模型用原生 NIM 推理栈。⑥ 监控运维：DCGM 监控硬件，Prometheus+Grafana 监控服务。',
        warning: '双机互联必须开启 GPUDirect RDMA 与 RoCE v2，否则张量并行性能将严重下降。',
        code: [
          ['vLLM 张量并行示例', '# 双机 TP=2 启动 vLLM\nvllm serve deepseek-v4-flash \\\n  --tensor-parallel-size 2 \\\n  --quantization nvfp4 \\\n  --max-model-len 1048576'],
        ],
      },
      {
        n: 4,
        title: '典型行业全链路模型组合方案',
        content: '① 软件研发企业（代码知识库+智能编程）：nemotron-ocr-v2 → page-elements-v3 → embed-1b → Milvus，核心 deepseek-v4-flash（双机 TP=2），安全 content-safety + gliner-pii。② 政企数字化（中文文档知识库+智能办公）：paddleocr + table-structure-v1 → bge-m3 → 向量库，核心 glm-5.2（双机 TP=2），安全 jailbreak-detect + 话题管控 + 内容安全。③ 生物制药（药物研发 AI 平台）：结构预测 AlphaFold2 + OpenFold3；分子设计 molmim + rfdiffusion；虚拟筛选 diffdock + esm2。',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════
     第三部分：YYC3 集群运维手册（NGC / Node / 健康检查 / 项目分类）
     ═══════════════════════════════════════════════════════════════ */

  /* ── 3.1 NGC CLI & nvcr.io 运维手册 ── */
  {
    id: 'ngc-nvcr-ops',
    order: 21,
    title: 'NGC CLI & nvcr.io 运维手册',
    titleEn: 'NGC CLI & nvcr.io Operation Manual',
    desc: 'NGC 命令行工具与 nvcr.io Docker 镜像仓库完整运维操作：初始化、鉴权、镜像推拉、模型下载、故障排查、安全规范。',
    icon: '🔐',
    cat: 'yyc3-ops',
    diff: 'medium',
    time: '15 分钟',
    overview: [
      ['🏢 组织 ID', '0949861471075582'],
      ['👥 业务团队', 'yyc3'],
      ['🔑 密钥类型', '组织 Service Key'],
      ['⚠️ 优先级', '环境变量 > 配置文件'],
    ],
    prereq: [
      '已安装 ngc-cli 并在 PATH 中可用',
      '已安装 Docker 且当前用户有 docker 权限',
      '持有本组织 Service Key（禁止跨组织使用 Personal Key）',
    ],
    steps: [
      {
        n: 1,
        title: '环境清理（故障优先执行）',
        content: '出现 401、密钥异常时优先全套清理：清除当前会话 NGC_API_KEY 环境变量；检查 shell 配置文件是否永久写入密钥；清空 ngc-cli 全部本地配置；清除 docker 侧 nvcr 仓库登录凭证。',
        warning: '强烈不建议将密钥写入 .bashrc / .zshrc 永久环境变量，极易造成新旧密钥冲突、鉴权 401。',
        code: [
          ['清除环境变量并检查', 'unset NGC_API_KEY\necho $NGC_API_KEY\ngrep -r "NGC_API_KEY" ~/.bashrc ~/.profile ~/.bash_profile ~/.zshrc'],
          ['清空 ngc-cli 配置', 'ngc config clear\ncat /home/yyc3/.ngc/config'],
          ['清除 docker nvcr 凭证', 'docker logout nvcr.io'],
        ],
      },
      {
        n: 2,
        title: 'NGC-CLI 初始化配置（全新部署）',
        content: '执行 ngc config set 交互式配置：粘贴组织 Service-Key，输出格式选 json，组织 ID 确认 0949861471075582，团队选择 yyc3。完成后密钥自动保存在 ~/.ngc/config，新开终端直接可用，无需配置环境变量。收紧配置文件权限为 600。',
        tip: '执行完成后密钥自动保存，新开终端直接可用，不需要配置环境变量。',
        code: [
          ['交互式配置', 'ngc config set'],
          ['收紧配置权限', 'chmod 600 /home/yyc3/.ngc/config'],
          ['查看当前配置', 'ngc config current'],
          ['身份鉴权校验', 'ngc user who'],
        ],
      },
      {
        n: 3,
        title: 'nvcr.io Docker 镜像仓库操作',
        content: 'docker login nvcr.io 登录：Username 填 $oauthtoken，Password 粘贴与 NGC CLI 相同的 Service-Key。docker 凭证独立保存在 ~/.docker/config.json，与 ngc-cli 配置互相独立。可拉取公开 CUDA 镜像测试连通性与鉴权。',
        code: [
          ['登录 nvcr.io', 'docker login nvcr.io'],
          ['公开镜像连通性测试', 'docker pull nvcr.io/nvidia/cuda:12.8.0-base-ubuntu24.04\ndocker rmi nvcr.io/nvidia/cuda:12.8.0-base-ubuntu24.04'],
          ['yyc3 团队私有镜像拉取', 'docker pull nvcr.io/0949861471075582/yyc3/镜像名称:tag'],
          ['本地镜像打标签推送', 'docker tag 本地镜像名:本地tag nvcr.io/0949861471075582/yyc3/镜像名称:tag\ndocker push nvcr.io/0949861471075582/yyc3/镜像名称:tag'],
        ],
      },
      {
        n: 4,
        title: 'NGC-CLI 资源查询（镜像 / 模型 / 团队）',
        content: '当前 CLI 版本不支持 --filter 参数，使用 grep/jq 做过滤。镜像查询可列出 yyc3 团队镜像；模型查询支持 grep 简单过滤与 jq JSON 高级过滤；可查看模型详情获取可用版本号。',
        tip: '安装 jq 以支持 JSON 高级过滤：sudo apt install jq',
        code: [
          ['列出 yyc3 团队镜像', 'ngc registry image list --team yyc3'],
          ['模型 grep 过滤', 'ngc registry model list | grep -i nemotron'],
          ['模型 jq 高级过滤', 'ngc registry model list --format_type json | jq \'.[] | select(.name|ascii_downcase|contains("nemotron"))\''],
          ['查看模型详情', 'ngc registry model describe nvidia/nemotron-mini-4b-instruct'],
          ['团队信息查询', 'ngc team list'],
        ],
      },
      {
        n: 5,
        title: 'NGC 模型权重下载（自带断点续传）',
        content: '使用 ngc registry model download-version 下载模型权重，支持断点续传——下载中断直接重复执行同一条命令自动续传。可指定本地下载目录。下载前务必确认磁盘空间充足，340B 级别模型占用磁盘极高。',
        warning: '下载大模型前监控磁盘剩余空间；340B 级别模型占用磁盘极高。',
        code: [
          ['默认目录下载 Nemotron-Mini-4B', 'ngc registry model download-version nvidia/nemotron-mini-4b-instruct:1.8.5'],
          ['指定目录下载', 'ngc registry model download-version nvidia/nemotron-mini-4b-instruct:1.8.5 --dest ./nemotron-mini-4b'],
          ['Nemotron-3-8B-Base 示例', 'ngc registry model download-version nvidia/nemotron-3-8b-base-4k:2.0.0 --dest ./nemotron3-8b-base'],
        ],
      },
      {
        n: 6,
        title: '故障排查手册（401/403/版本不存在）',
        content: '401 Unauthorized：unset 环境变量，确认组织 ID 正确，使用本组织 Service Key，config clear 后重新 set。注意 docker login 成功 ≠ ngc-cli 鉴权正常。403 Forbidden：密钥组织正确但缺少团队权限，网页确认加入 yyc3 团队，权限同步有延迟重试。版本不存在：执行 model describe 获取真实可用版本号。',
        warning: 'docker login 成功 ≠ ngc-cli 鉴权正常，docker 仅校验密钥格式，不校验组织归属。',
      },
      {
        n: 7,
        title: '安全运维规范与密钥存储模式对比',
        content: 'Service Key 废弃后网页 API-Keys 页面务必删除。禁止硬编码密钥入脚本/rc/日志。脚本临时用环境变量，执行完立即 unset。.ngc/config 权限设 600。三种密钥存储模式：① ngc config set 写入配置文件（✅ 推荐，新终端直接可用）；② shell rc 永久环境变量（❌ 禁止，新旧密钥冲突）；③ 脚本会话临时 export（⚠️ 仅一次性脚本）。',
        tip: 'docker 登录凭证独立存储，执行 docker login nvcr.io 一次即可，与 ngc-cli 配置互不干扰。',
      },
    ],
  },

  /* ── 3.2 NGC 健康自检脚本 ── */
  {
    id: 'ngc-health-check',
    order: 22,
    title: 'NGC 健康自检脚本',
    titleEn: 'NGC Health Check Script',
    desc: '一键自检 NGC 环境健康度：API Key 状态、CLI 配置、身份鉴权、公开镜像拉取、团队镜像列表。',
    icon: '🩺',
    cat: 'yyc3-ops',
    diff: 'easy',
    time: '3 分钟',
    overview: [
      ['📋 检查项', '5 项'],
      ['🏷️ 脚本名', 'ngc_health_check.sh'],
      ['⚡ 执行', 'set -e 严格模式'],
    ],
    prereq: ['已完成 NGC-CLI 初始化配置', '已安装 Docker 并有 docker 权限'],
    steps: [
      {
        n: 1,
        title: '脚本用途与 5 项检查项',
        content: '该脚本一键自检 NGC 环境健康度，使用 set -e 严格模式（任一步骤失败立即退出）。5 项检查依次为：① NGC_API_KEY 环境变量状态；② ngc-cli 当前配置；③ 身份鉴权校验（ngc user who）；④ nvcr 公开镜像拉取测试（拉取后删除释放磁盘）；⑤ yyc3 团队镜像列表查询。',
      },
      {
        n: 2,
        title: '完整脚本内容',
        content: '保存为 ngc_health_check.sh，赋权后执行即可一键自检。',
        code: [
          ['ngc_health_check.sh', '#!/bin/bash\nset -e\necho "=====1.检查NGC_API_KEY环境变量===="\necho "NGC_API_KEY: [$NGC_API_KEY]"\n\necho -e "\\n=====2.ngc-cli当前配置===="\nngc config current\n\necho -e "\\n=====3.身份校验===="\nngc user who\n\necho -e "\\n=====4.测试nvcr公开镜像拉取===="\ndocker pull nvcr.io/nvidia/cuda:12.8.0-base-ubuntu24.04\ndocker rmi nvcr.io/nvidia/cuda:12.8.0-base-ubuntu24.04\n\necho -e "\\n=====5.查询yyc3团队镜像列表===="\nngc registry image list --team yyc3\n\necho -e "\\n=====健康检查完成===="'],
          ['赋权并执行', 'chmod +x ngc_health_check.sh && ./ngc_health_check.sh'],
        ],
        tip: '该脚本本质上是 NGC 运维手册第 6 章的自动化封装，建议每次密钥变更或环境迁移后执行一次。',
      },
      {
        n: 3,
        title: '结果解读与故障定位',
        content: '脚本因 set -e 在首个失败步骤即退出，据此可快速定位故障层级：第 1 步失败→环境变量配置问题；第 2 步失败→ngc-cli 未配置或配置文件损坏；第 3 步失败→鉴权失败（401/403），参考 NGC 运维手册故障排查；第 4 步失败→docker 未登录 nvcr.io 或网络问题；第 5 步失败→团队权限不足或团队名错误。',
        warning: '第 1 步 NGC_API_KEY 显示为空不一定是故障——若采用 ngc config set 写入配置文件模式，环境变量本应为空，CLI 会从配置文件读取密钥。',
      },
    ],
  },

  /* ── 3.3 YYC3 Node 服务标准化运维手册 ── */
  {
    id: 'yyc3-node-ops',
    order: 23,
    title: 'YYC3 Node 服务标准化运维手册',
    titleEn: 'YYC3 Node Service Operation Manual',
    desc: '双 DGX 节点 Node 运行架构、Systemd 托管规范、故障排查标准，彻底解决跨用户权限报错、环境混乱、服务启动失败等历史问题。',
    icon: '⚙️',
    cat: 'yyc3-ops',
    diff: 'medium',
    time: '20 分钟',
    overview: [
      ['🖥️ 集群', 'YYC3 双 DGX Spark'],
      ['👤 运行用户', 'yyc3（统一）'],
      ['📦 Node 版本', 'v22.23.1'],
      ['🔧 托管方式', 'Systemd'],
    ],
    prereq: ['两台 DGX 节点已联网且 SSH 互通', 'yyc3 用户已创建并有 sudo 权限'],
    steps: [
      {
        n: 1,
        title: '集群硬件与账号架构（最终定型）',
        content: '节点对应关系（唯一标准）：物理机 yyc3-101 ｜ 远程别名 yyc3-n1；物理机 yyc3-102 ｜ 远程别名 yyc3-n2。用户架构（已统一整改）：统一运行用户 yyc3（SSH 默认登录用户，全程无权限冲突）；Node 环境归属用户 yyc3；项目源码归属目录 /home/yyc3/xxx-projects；Systemd 运行用户 yyc3（杜绝一切跨用户授权）。',
        warning: '历史问题：前期使用 yyc3-101/yyc3-102 部署 Node，项目代码在 yyc3 用户目录，造成跨用户权限隔离、CHDIR 报错、Permission denied。',
      },
      {
        n: 2,
        title: '全局环境基线（两台节点完全一致）',
        content: 'NVM 版本 0.40.4；Node 版本 v22.23.1（默认常驻版本）；Node 绝对路径（全局唯一启动路径）/home/yyc3/.nvm/versions/node/v22.23.1/bin/node。NPM 镜像源已统一配置国内镜像永久生效。NVM 环境加载必须使用 POSIX 兼容写法。',
        code: [
          ['配置 NPM 国内镜像', 'npm config set registry https://registry.npmmirror.com'],
          ['NVM 环境加载标准脚本', 'export NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"'],
        ],
      },
      {
        n: 3,
        title: '节点项目目录规范',
        content: '强制规范：所有 Node 业务代码必须存放于对应根目录内，禁止跨目录、跨节点挂载运行。yyc3-n1（yyc3-101）项目根目录：/home/yyc3/yyc3-101-projects。yyc3-n2（yyc3-102）项目根目录：/home/yyc3/yyc3-102-projects。',
      },
      {
        n: 4,
        title: 'Systemd 服务标准化模板',
        content: '服务文件名统一：yyc3-node.service。模板核心字段：User/Group=yyc3，WorkingDirectory 指向对应项目根目录，ExecStart 使用 Node 完整绝对路径，Restart=on-failure，日志输出 journal+console。',
        warning: 'Systemd 禁止简写 node，必须使用完整绝对路径 /home/yyc3/.nvm/versions/node/v22.23.1/bin/node。',
        code: [
          ['yyc3-n1 服务模板', '[Unit]\nDescription=YYC3 Node Service (yyc3-n1)\nAfter=network.target\n\n[Service]\nUser=yyc3\nGroup=yyc3\nWorkingDirectory=/home/yyc3/yyc3-101-projects\nExecStart=/home/yyc3/.nvm/versions/node/v22.23.1/bin/node 【替换为真实JS入口文件】\nRestart=on-failure\nRestartSec=3\nStandardOutput=journal+console\nStandardError=journal+console\n\n[Install]\nWantedBy=multi-user.target'],
        ],
      },
      {
        n: 5,
        title: '服务部署标准流程（固定步骤）',
        content: '部署前置铁律：必须手动测试启动成功后，再写入 Systemd！① 查找项目 JS 入口（find . -type f -name "*.js"）；② 手动测试启动（用完整路径 node 入口文件）；③ 写入 Systemd 服务；④ 生效并启动（daemon-reload + enable --now）；⑤ 查验状态与日志。',
        tip: '前置测试原则：手动终端启动成功，方可托管系统服务。',
        code: [
          ['查找项目 JS 入口', 'cd /home/yyc3/对应项目目录\nfind . -type f -name "*.js"'],
          ['手动测试启动', '/home/yyc3/.nvm/versions/node/v22.23.1/bin/node 你的入口文件.js'],
          ['生效并启动服务', 'sudo systemctl daemon-reload\nsudo systemctl enable --now yyc3-node.service'],
          ['查验状态与日志', 'sudo systemctl status yyc3-node.service\njournalctl -u yyc3-node.service -f'],
        ],
      },
      {
        n: 6,
        title: '历史故障复盘与根治方案',
        content: '故障 1（status=200/CHDIR）：原因跨用户运行、目录无遍历权限、WorkingDirectory 错误；根治统一 yyc3 用户运行。故障 2（MODULE_NOT_FOUND app.js）：原因项目无 app.js、入口文件名硬编码错误；根治动态查找真实 JS 入口，禁止固定 app.js 模板。故障 3（Permission denied）：原因 yyc3-101/102 访问 yyc3 目录权限不足；根治全员统一 yyc3 用户，无需 ACL 授权。',
      },
      {
        n: 7,
        title: '集群永久运维规范（SOP）',
        content: '五条铁律：① 三统一原则——运行用户、Node 环境、项目目录必须统一为 yyc3；② 路径强制原则——Systemd 禁止简写 node，必须完整绝对路径；③ 前置测试原则——手动终端启动成功方可托管；④ 配置重载原则——修改 .service 文件后必须 daemon-reload；⑤ 环境归一原则——废弃 yyc3-101/102 的 NVM 环境，避免环境混淆。',
      },
    ],
  },

  /* ── 3.4 项目分类目录 ── */
  {
    id: 'project-classification',
    order: 24,
    title: '项目分类目录',
    titleEn: 'Project Classification Catalog',
    desc: 'NVIDIA Workbench 80 个项目全量分类：核心库与平台 47 个 + AI Blueprints 31 个场景方案，9 大根分类 + 10 大蓝图场景。',
    icon: '🗂️',
    cat: 'yyc3-ops',
    diff: 'easy',
    time: '15 分钟',
    overview: [
      ['📊 项目总数', '80 个'],
      ['🏢 NVIDIA 官方', '72 (90%)'],
      ['🤝 第三方合作', '3 (3.8%)'],
      ['📁 根分类', '9 大'],
    ],
    steps: [
      {
        n: 1,
        title: '第一部分：核心库与平台（47 个项目）',
        content: '9 大根分类：① CUDA 核心计算库（5 个：cccl/nccl/cuda-python/cuda-quantum/nvmath-python）；② AI/ML 训练框架（4 个：Megatron-LM/apex/JAX-Toolbox/kvpress）；③ AI 推理引擎（4 个：TensorRT-LLM/TransformerEngine/Model-Optimizer/onnx-tensorrt）；④ NeMo 智能体生态（5 个：NeMo-Fabric/Relay/NemoClaw/Toolkit-UI/awesome-openclaw-skills）；⑤ RAPIDS 数据科学（7 个：cuvs/cuopt/cuFOLIO/cudf-spark 等）；⑥ 云基础设施（9 个：nvcf/aicr/gpu-operator/OSMO/aistore 等）；⑦ 硬件平台（6 个：DGX Spark playbooks/benchmarking 等）；⑧ AI Agent 安全（4 个：OpenShell/garak/skills/xr-ai）；⑨ 平台 SDK 与模型（5 个：holoscan-sdk/cosmos/nodewright 等）。',
      },
      {
        n: 2,
        title: '第二部分：AI Blueprints（31 个场景方案）',
        content: '10 大蓝图场景：① Agentic AI 智能体（6 个：aiq/nemotron-voice-agent/goose/hermes-agent/Multi-Agent-Warehouse/Retail-Agentic-Commerce）；② RAG 检索增强（3 个）；③ 安全合规（2 个）；④ 金融服务（4 个）；⑤ 零售电商（2 个）；⑥ 媒体内容（3 个）；⑦ 3D 视觉生成（2 个）；⑧ 基础工具（4 个）；⑨ 医疗科学（2 个）；⑩ 通用 AI 平台（3 个）。标注规则：🟢 NVIDIA 官方 | 🟡 第三方合作 | 🔴 已弃用。',
        tip: '已弃用项目 3 个：llm-router、data-flywheel、safety-for-agentic-ai，部署选型时注意规避。',
      },
      {
        n: 3,
        title: '全局统计：归属与许可证',
        content: '归属：NVIDIA 官方 72 (90%)、第三方合作 3 (3.8%)（pydantic-ai/hermes-agent/goose）、无 LICENSE 5 (6.2%)。许可证分布：Apache 2.0 占 63 个（绝对主力）；MIT 5 个；NVIDIA 自定义 1 个（Megatron-LM）；BSD-like 1 个（apex）；OpenMDW 1.1 1 个（cosmos）；CC BY-NC-SA 4.0 1 个；双许可 2 个。',
      },
      {
        n: 4,
        title: '技术栈分布',
        content: 'Python 35 项（28%，绝对主力）；Docker/K8s 20+ 项（16%）；Go 7 项（6%）；C++/CUDA 6 项（5%）；TypeScript/React 6 项（5%）；Rust 3 项（2%）；Java 3 项（2%）；Bazel 2 项。Python + Docker 合计占比超 44%，是本工作台的核心技术栈组合。',
      },
      {
        n: 5,
        title: '目录结构与命名规范',
        content: '根目录 9 大分类 + Blueprints 10 大场景，全部采用 4 字中文命名（核心计算-并行加速、训练框架-分布式训练、推理引擎、智能体态-编排调度、数据科学-分析处理、云基平台-基础服务、安全工具-红队攻防、平台模型-推理引擎、蓝图方案-场景落地）。每个分类下按项目英文原名建子目录，便于跨语言检索。',
        tip: '4 字中文命名兼顾语义清晰与视觉整齐，符合「标准化·规范化」的运维理念。',
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   SKILLS — NVIDIA Skills 数据（占位，可后续扩展）
   ═══════════════════════════════════════════════════════════════ */
var SKILLS = [];

/* ═══════════════════════════════════════════════════════════════
   COMMANDS — 命令库数据（占位，可后续扩展）
   ═══════════════════════════════════════════════════════════════ */
var COMMANDS = [];
